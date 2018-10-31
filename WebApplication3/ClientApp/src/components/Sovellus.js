import React, { Component } from 'react';
import axios from 'axios';

export class Sovellus extends Component {
    displayName = Sovellus.name

    constructor(props) {
        super(props);
        this.state = {
            talot: [],
            talonTiedot: [],
            loadingTalonTiedot: true,
            talonValot: [],
            loadingTalonValot: true,
            talonSaunat: [],
            loadingTalonSaunat: true
        };
    }

    componentDidMount() {
        axios
            .get('api/Talot')
            .then(x => {
                this.setState({
                    talot: x.data
                });
            });
    }

    //TALOJEN LISTAUS

    renderTalot() {
        return (
            <div className='btn-group btn-group-justified'>
                {this.state.talot.map(x => (
                    <div className="btn-group" key={x.taloId}>
                        <button type="button" className={this.talonapinVari(x.taloId)} onClick={this.talonValinta(x.taloId)}>{x.talonNimi}</button>
                    </div>
                )
                )}
            </div>
        );
    }

    talonapinVari = (id) => {
        if (this.state.talonTiedot.taloId === id) {
            return 'btn btn-primary btn-lg';
        }
        else {
            return 'btn btn-lg';
        }
    }

    //TALON TIETOJEN HAKEMINEN: LÄMPÖTILAT, VALOT, SAUNAT

    talonValinta = (id) => () => {   
        axios
            .get('api/TalonTiedot/' + id)
            .then(x => {
                this.setState({
                    talonTiedot: x.data,
                    loadingTalonTiedot: false
                });
            });

        axios
            .get('api/Valot/' + id)
            .then(x => {
                this.setState({
                    talonValot: x.data,
                    loadingTalonValot: false
                });
            });

        axios
            .get('api/Saunat/' + id)
            .then(x => {
                this.setState({
                    talonSaunat: x.data,
                    loadingTalonSaunat: false
                });
            });
    };

    // TALON TIETOJEN RENDERÖINTI JA SLIDERIN SÄÄTÖ 

    renderTalonTiedot() {
        return (
            <div key={this.state.talonTiedot.taloId}>
                <h2>Talon tiedot</h2>
                <h4>Nykylämpötila: {this.state.talonTiedot.talonNykylampotila} &deg;C &nbsp;
                <button className="btn btn-xs" onClick={this.handleTalonTarkistus()}>Tarkista</button></h4>
                <h4 className="erikoistapaus">Tavoitelämpötila: {this.state.talonTiedot.talonTavoitelampotila} &deg;C</h4>
                <input onMouseUp={this.handleSliderMouseUp} onChange={this.handleSlider} type="range" min="14" max="28" value={this.state.talonTiedot.talonTavoitelampotila} step="1" />
            </div>
        );
    }

    handleSlider = (event) => {
        const apu = { ...this.state.talonTiedot, talonTavoitelampotila: parseInt(event.target.value, 10) };
        this.setState({ talonTiedot: apu });
    }

    handleSliderMouseUp = () => {
        const data = this.state.talonTiedot;
        const url = 'api/MuutaTalonTietoja?taloId=' + data.taloId + '&talonTavoitelampotila=' + data.talonTavoitelampotila;
        axios
            .post(url)
            //.post('api/MuutaTalonTietoja', data) <-- tämä ei jostain syystä toimi, lähetetään tiedot perinteisesti
            .then(x => {
            });
    }

    handleTalonTarkistus = () => () => {
        const apu = this.state.talonTiedot.talonTavoitelampotila;
        const data = { ...this.state.talonTiedot, talonNykylampotila: apu };
        const url = 'api/MuutaTalonTietoja?taloId=' + data.taloId;
        axios
            .post(url)
            .then(x => {
                this.setState({ talonTiedot: data });
            });
    }
    
    // VALOJEN RENDERÖINTI JA NAPPIEN KLIKKAILU

    renderTalonValot() {
        return (
            <div>
                <h3>Huoneiden valaistus</h3>
                {this.state.talonValot.map(x =>
                    <this.renderValo key={x.valoId} valo={x} />
                )}
            </div>
        );
    }

    renderValo = ({ valo }) => {
        return (
            <div>
                <h4>{valo.valonNimi}</h4>
                <div className='btn-group btn-group-justified'>
                    <this.renderValoNappi value='0' nimi='Pois' id={valo.valoId} />
                    <this.renderValoNappi value='33' nimi='Himmeä' id={valo.valoId} />
                    <this.renderValoNappi value='66' nimi='Puolivalot' id={valo.valoId} />
                    <this.renderValoNappi value='100' nimi='Kirkas' id={valo.valoId} />
                </div>
            </div>
        );
    }

    renderValoNappi = ({ id, value, nimi }) => {
        return (
            <div className="btn-group">
                <button type="button" className={this.valonapinVari(id, value)} onClick={this.handleValonapinKlikkaus(id, value)}>{nimi}</button>
            </div>
        );
    }

    valonapinVari = (id, value) => {
        const apu = parseInt(this.state.talonValot.find(x => x.valoId === id).valonMaara, 10);
        if (apu === parseInt(value, 10)) {
            return 'btn btn-success';
        }
        else {
            return 'btn';
        }
    }

    handleValonapinKlikkaus = (id, value) => () => {
        const apu = this.state.talonValot.find(x => x.valoId === id);
        const data = { ...apu, valonMaara: value };
        const url = 'api/MuutaValonTilaa?valoId=' + data.valoId + '&valonMaara=' + data.valonMaara;
        axios
            .post(url)
            .then(x => {
                if (x) {
                    this.setState({
                        talonValot: this.state.talonValot.map(x => x.valoId !== id ? x : data)
                    });
                }
            });
    }

    // SAUNOJEN RENDERÖINTI JA NAPPIEN KLIKKAILU

    renderTalonSaunat() {
        return (
            <div>
                <h3>Saunat</h3>
                {this.state.talonSaunat.map(x =>
                    <this.renderSauna key={x.saunaId} sauna={x} />
                )}
            </div>
        );
    }

    renderSauna = ({ sauna }) => {
        return (
            <div>
                <h4>{sauna.saunanNimi} {sauna.saunanNykylampotila} &deg;C &nbsp;
                <button className="btn btn-xs" onClick={this.handleSaunanMittaus(sauna.saunaId)}>Tarkista</button></h4>
                <div className='btn-group btn-group-justified'>
                    <this.renderSaunaNappi tila={false} id={sauna.saunaId} />
                    <this.renderSaunaNappi tila id={sauna.saunaId} />
                </div>
            </div>
        );
    }

    renderSaunaNappi = ({ id, tila }) => {
        const nimi = tila ? 'Päällä' : 'Pois';
        return (
            <div className="btn-group">
                <button type="button" className={this.saunanapinVari(id, tila)} onClick={this.handleSaunanapinKlikkaus(id, tila)}>{nimi}</button>
            </div>
        );
    }

    saunanapinVari = (id, tila) => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id).saunanTila;
        if (apu === tila) {
            return 'btn btn-danger';
        }
        else {
            return 'btn';
        }
    }

    handleSaunanapinKlikkaus = (id, tila) => () => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id);
        const data = { ...apu, saunanTila: tila };
        const url = 'api/MuutaSaunanTilaa?saunaId=' + id + '&saunanTila=' + tila;
        axios
            .post(url)
            .then(x => {
                if (x) {
                    this.setState({
                        talonSaunat: this.state.talonSaunat.map(x => x.saunaId !== id ? x : data)
                    });
                }
            });
    }

    handleSaunanMittaus = (id) => () => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id);
        axios
            .get('api/MittaaSauna/' + id)
            .then(x => {
                const data = { ...apu, saunanNykylampotila: x.data };
                this.setState({
                    talonSaunat: this.state.talonSaunat.map(x => x.saunaId !== id ? x : data)
                });
            });
    }

    // KOKO SIVUN RENDERÖINTI

    render() {
        let contentsTalonTiedot = this.state.loadingTalonTiedot
            ? null : this.renderTalonTiedot();
        let contentsTalonValot = this.state.loadingTalonValot
            ? null : this.renderTalonValot();
        let contentsTalonSaunat = this.state.loadingTalonSaunat
            ? null : this.renderTalonSaunat();

        return (
            <div>
                <h1>Talot</h1>
                {this.renderTalot()}
                {contentsTalonTiedot}
                {contentsTalonValot}
                {contentsTalonSaunat}
            </div>
        );
    }
}