<template>
    <div class="wallet_sidebar">
        <div class="stick">
            <div class="brand">
                <img src="@/assets/wallet_logo.svg" v-if="$root.theme === 'day'" />
                <img src="@/assets/wallet_logo_dark.svg" v-else />
            </div>
            <div class="links">
                <router-link to="/wallet">
                    <img src="@/assets/sidebar/portfolio_nav.png" v-if="$root.theme === 'day'" />
                    <img src="@/assets/sidebar/portfolio_nav_night.png" v-else />
                    {{ $t('wallet.sidebar.portfolio') }}
                </router-link>
                <router-link class="wallet_link" data-cy="wallet_transfer" to="/wallet/transfer">
                    <img src="@/assets/sidebar/transfer_nav.png" v-if="$root.theme === 'day'" />
                    <img src="@/assets/sidebar/transfer_nav_night.svg" v-else />
                    {{ $t('wallet.sidebar.send') }}
                </router-link>
                <!--
                <router-link
                    class="wallet_export wallet_link"
                    data-cy="wallet_export"
                    to="/wallet/cross_chain"
                >
                    <span><fa class="icon" icon="random"></fa></span>
                    {{ $t('wallet.sidebar.export') }}
                </router-link>
                todo-lirax Are we gonna keep wallet-export(cross-chain)?
                -->
                <!--
                <router-link class="wallet_link" data-cy="wallet_studio" to="/wallet/studio">
                    <img src="@/assets/sidebar/studio_nav.svg" v-if="$root.theme === 'day'" />
                    <img src="@/assets/sidebar/studio_nav_night.svg" v-else />
                    {{ $t('wallet.sidebar.studio') }}
                </router-link>
                todo-lirax Are we gonna keep wallet-studio?
                -->
                <router-link class="wallet_link" data-cy="wallet_manage" to="/wallet/keys">
                    <img src="@/assets/sidebar/manage_nav.png" v-if="$root.theme === 'day'" />
                    <img src="@/assets/sidebar/manage_nav_night.svg" v-else />
                    {{ $t('wallet.sidebar.manage') }}
                </router-link>
            </div>
            <div class="bottom">
                <LanguageSelect></LanguageSelect>
            </div>
        </div>
    </div>
</template>
<script>
import LanguageSelect from '@/components/misc/LanguageSelect/LanguageSelect'

export default {
    components: {
        LanguageSelect,
    },
}
</script>
<style lang="scss" scoped>
@use "../../main";

.wallet_sidebar {
    position: relative;

    .stick {
        position: sticky;
        display: flex;
        flex-direction: column;
        height: 100%;
        top: 0;
    }

    .alert_icon {
        color: #f00;
        flex-grow: 1;
        justify-content: flex-end;
    }

    .brand {
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 80%;
            object-fit: contain;
        }
    }

    .links {
        padding: 0 !important;
        display: flex;
        flex-direction: column;

        a {
            display: flex;
            align-items: center;
            padding: 14px 24px;
            white-space: nowrap;
            opacity: 0.6;
            color: var(--primary-color-light);
            text-decoration: none;

            img {
                opacity: 0.5;
            }
        }

        a.router-link-exact-active,
        .wallet_link.router-link-active {
            color: var(--primary-color) !important;
            opacity: 1;
            background-color: var(--bg-wallet);

            img {
                opacity: 1;
            }
        }

        img {
            width: 20px;
            margin-right: 15px;
            object-fit: contain;
        }
    }
}

.wallet_export {
    span {
        display: block;
        margin-right: 15px;
        width: 20px;
    }
}

.bottom {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 20px;
}
</style>
