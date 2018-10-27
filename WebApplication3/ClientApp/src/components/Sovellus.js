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
        //console.log('component did mount');
        axios
            .get('api/Talot')
            .then(x => {
                this.setState({
                    talot: x.data
                });
            });
    }

    //TALOJEN LISTAUS

    talonapinVari = (id) => {
        if (this.state.talonTiedot.taloId === id) {
            return 'btn btn-primary btn-lg';
        }
        else {
            return 'btn btn-lg';
        }
    }

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


    //TALON TIETOJEN HAKEMINEN: L�MP�TILAT, VALOT, SAUNAT

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


    // TALON TIETOJEN RENDER�INTI JA SLIDERIN S��T� 

    handleSlider = (event) => {
        const data = { ...this.state.talonTiedot, talonTavoitelampotila: parseInt(event.target.value, 10) };
        const url = 'api/MuutaTalonTietoja?taloId=' + data.taloId + '&talonTavoitelampotila=' + data.talonTavoitelampotila;
        axios
            .post(url)
            //.post('api/MuutaTalonTietoja', data) <-- t�m� ei jostain syyst� toimi, l�hetet��n tiedot perinteisesti
            .then(x => {
            });
        this.setState({ talonTiedot: data });
    }

    handleTalonMittaus = () => () => {
        const value = this.state.talonTiedot.talonTavoitelampotila;
        const data = { ...this.state.talonTiedot, talonNykylampotila: value };
        //console.log(data);
        const url = 'api/MuutaTalonTietoja?taloId=' + data.taloId;
        axios
            .post(url)
            .then(x => {
                this.setState({ talonTiedot: data });
            });
    }

    renderTalonTiedot() {
        return (
            <div key={this.state.talonTiedot.taloId}>
                <br />
                <h2>Talon tiedot</h2>
                <h4>Nykylampotila: {this.state.talonTiedot.talonNykylampotila} &deg;C &nbsp;
                <button className="btn btn-sm" onClick={this.handleTalonMittaus()}>Tarkista</button></h4>
                <h4 className="erikoistapaus">Tavoitelampotila: {this.state.talonTiedot.talonTavoitelampotila} &deg;C</h4>
                <input onChange={this.handleSlider} type="range" min="14" max="28" value={this.state.talonTiedot.talonTavoitelampotila} step="1" />
            </div>
        );
    }

    // VALOJEN RENDER�INTI JA NAPPIEN KLIKKAILU

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

    renderValoNappi = (props) => {
        return (
            <div className="btn-group">
                <button type="button" className={this.valonapinVari(props.id, props.value)} onClick={this.handleValonapinKlikkaus(props.id, props.value)}>{props.nimi}</button>
            </div>
        );
    }


    renderValo = ({ valo }) => {
        return (
            <div>
                <h4>{valo.valonNimi}</h4>
                <div className='btn-group btn-group-justified'>
                    <this.renderValoNappi value='0' nimi='Pois' id={valo.valoId} />
                    <this.renderValoNappi value='33' nimi='Himmea' id={valo.valoId} />
                    <this.renderValoNappi value='66' nimi='Puolivalot' id={valo.valoId} />
                    <this.renderValoNappi value='100' nimi='Kirkas' id={valo.valoId} />
                </div>
            </div>
        );
    }

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


    // SAUNOJEN RENDER�INTI JA NAPPIEN KLIKKAILU

    handleSaunanMittaus = (id) => () => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id);
        axios
            .get('api/MittaaSauna/' + id)
            .then(x => {
                const apu2 = { ...apu, saunanNykylampotila: x.data };
                this.setState({
                    talonSaunat: this.state.talonSaunat.map(x => x.saunaId !== id ? x : apu2)
                });
            });
    }

    saunanapinVari = (id, nimi) => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id).saunanTila;
        let apu2 = false;
        if (nimi === "Paalla") {
            apu2 = true;
        }
        if (apu === apu2) {
            return 'btn btn-danger';
        }
        else {
            return 'btn';
        }
    }

    handleSaunanapinKlikkaus = (id, nimi) => () => {
        const apu = this.state.talonSaunat.find(x => x.saunaId === id);
        let apu2 = false;
        if (nimi === "Paalla") {
            apu2 = true;
        }
        const data = { ...apu, saunanTila: apu2 };

        //console.log(apu);
        const url = 'api/MuutaSaunanTilaa?saunaId=' + data.saunaId + '&saunanTila=' + apu2;
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

    renderSaunaNappi = ({ id, nimi }) => {
        //const nimi = tila ? 'Paalla' : 'Pois';
        console.log(id, nimi);
        return (
            <div className="btn-group">
                <button type="button" className={this.saunanapinVari(id, nimi)} onClick={this.handleSaunanapinKlikkaus(id, nimi)}>{nimi}</button>
            </div>
        );
    }

    renderSauna = ({ sauna }) => {
        return (
            <div>
                <h4>{sauna.saunanNimi} {sauna.saunanNykylampotila}&deg;C &nbsp;
                <button className="btn btn-sm" onClick={this.handleSaunanMittaus(sauna.saunaId)}>Tarkista</button></h4>
                <div className='btn-group btn-group-justified'>
                    <this.renderSaunaNappi nimi='Pois' id={sauna.saunaId} />
                    <this.renderSaunaNappi nimi='Paalla' id={sauna.saunaId} />
                </div>
            </div>
        );
    }

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


    // KOKO SIVUN RENDER�INTI

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
