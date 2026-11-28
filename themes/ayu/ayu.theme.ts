// The ayu theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in ayu.settings.json and the generated ayu.settings.ts;
// change them with `astryx experimental theme editor set ayu ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {ayuSettings} from './ayu.settings';

export const ayuTheme = defineTheme({
  extends: ayuSettings,
  name: 'ayu',
});
