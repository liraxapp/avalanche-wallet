import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import Home from '../views/Home.vue'

import Transfer from '@/views/wallet/Transfer.vue'
import ManageKeys from '@/views/wallet/ManageKeys.vue'
import Menu from '../views/access/Menu.vue'
import Keystore from '../views/access/Keystore.vue'
import Mnemonic from '@/views/access/Mnemonic.vue'
import PrivateKey from '@/views/access/PrivateKey.vue'
import Access from '../views/access/Access.vue'
import Create from '@/views/Create.vue'
import Wallet from '@/views/Wallet.vue'
import WalletHome from '@/views/wallet/Portfolio.vue'

Vue.use(VueRouter)

import store from '../store/index'
import Studio from '@/views/wallet/Studio.vue'
import Export from '@/views/wallet/CrossChain.vue'

const ifNotAuthenticated = (to: Route, from: Route, next: Function) => {
    if (!store.state.isAuth) {
        next()
        return
    }
    next('/wallet')
}

const ifAuthenticated = (to: Route, from: Route, next: Function) => {
    if (store.state.isAuth) {
        next()
        return
    }
    next('/')
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/access',
        children: [
            {
                path: '/',
                name: 'access',
                component: Menu,
            },
            {
                path: 'keystore',
                component: Keystore,
            },
            {
                path: 'privatekey',
                component: PrivateKey,
            },
            {
                path: 'mnemonic',
                component: Mnemonic,
            },
        ],
        component: Access,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/create',
        name: 'create',
        component: Create,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/wallet',
        children: [
            {
                path: '/',
                name: 'wallet',
                component: WalletHome,
            },
            {
                path: 'transfer',
                component: Transfer,
            },
            /* todo-lirax are we gonna keep cross_chain?
            {
                path: 'cross_chain',
                component: Export,
            },
            */
            {
                path: 'keys',
                component: ManageKeys,
            },
            /* todo-lirax are we gonna keep studio?
            {
                path: 'studio',
                component: Studio,
            },
            */
        ],
        component: Wallet,
        beforeEnter: ifAuthenticated,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
