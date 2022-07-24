/* @refresh reload */
import { createAppRootComponent } from '@local-core/ui'
import '@local-core/ui/dist/style.css'
import { ServiceInstances } from './services'
import {render} from 'solid-js/web'

const App = createAppRootComponent(ServiceInstances);

render(() => <App />, document.getElementById('app')!)