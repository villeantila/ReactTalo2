import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
//import { Home } from './components/Home';
import { Sovellus } from './components/Sovellus';
//import { Counter } from './components/Counter';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
            <Route exact path='/' component={Sovellus} />

      </Layout>
    );
  }
}

//<Route path='/counter' component={Counter} />
//    <Route path='/sovellus' component={Sovellus} />
