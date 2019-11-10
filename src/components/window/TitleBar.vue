<template>
    <div class="TitleBar">
        <b-navbar type="dark" variant="dark" tag="div">
            <b-navbar-brand>
                <img src="favicon.ico" class="d-inline-block align-top" alt="Kitten">
            </b-navbar-brand>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">

                <b-nav-item @click="windowAction('minimize')">
                    <svg name="TitleBarMinimize" aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                        <rect fill="#ffffff" width="10" height="1" x="1" y="6"></rect>
                    </svg>
                </b-nav-item>
                <b-nav-item @click="windowAction('toggleMaximize')">
                    <svg name="TitleBarMaximize" aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                        <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="#ffffff"></rect>
                    </svg>
                </b-nav-item>
                <b-nav-item @click="windowAction('close')">
                    <svg name="TitleBarClose" aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                        <polygon fill="#ffffff" fill-rule="evenodd"
                                 points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
                    </svg>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>

    let keymap = [];

    document.onkeypress = function(event) {
        keymap.push(event.key);
        if (keymap.join('') === 'test') {
            document.getElementsByClassName('navbar')[0].style.backgroundImage = "url(http://giphygifs.s3.amazonaws.com/media/sIIhZliB2McAo/giphy.gif)";
        }
    }

    const {remote} = require('electron');
    const BrowserWindow = remote.getCurrentWindow();
    const Menu = remote.Menu;

    export default {
        name: "TitleBar",
        props: ['title'],
        data: function() {
            return {
                ApplicationMenu: Menu.getApplicationMenu()
            }
        },
        methods: {
            windowAction(method) {
                switch (method) {
                    case 'toggleMaximize':
                        if (BrowserWindow.isMaximized()) {
                            BrowserWindow.unmaximize()
                        } else {
                            BrowserWindow.maximize()
                        }
                        break;

                    default:
                        if (typeof BrowserWindow[method] === 'function') {
                            BrowserWindow[method]()
                        }
                        break;
                }
            }
        }
    }
</script>

<style>

    .navbar {
        background-position: center;
        background-size: contain;
    }

    .TitleBar {
        font-size: 0.8rem
    }

    .TitleBar .dropdown-menu {
        margin: .25rem 0;
    }

    .TitleBar .navbar {
        -webkit-app-region: drag;
        height: 1.8rem;
        padding: 0;
    }

    .TitleBar .navbar-brand, .TitleBar img {
        height: 100%;
    }
    
    .navbar-nav > li > a {
        padding: 0;
    }

    .TitleBar .navbar-nav {
        -webkit-app-region: no-drag;
    }

    .TitleBar .nav-item a {
        -webkit-user-drag: none;
        user-select: none;
    }

    .TitleBar .nav-item:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .sub-menu > button,
    .sub-menu > button:active,
    .sub-menu > button:hover {    
        border: none;
        background: transparent;
        padding: unset;
        color: inherit;
        text-align: left;
        font: inherit;
    }

    .sub-menu > .dropdown-menu {
        top: -13px;
    } 

    .sub-menu:hover > ul {
        display: block;
    }

    .navbar-brand {
        padding-left: 0.5rem;
    }

</style>