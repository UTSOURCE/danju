import { initialize, setAssetPath } from '@ionic/core/components';

// Ionic 9 不再由 IonicModule 自动注入图标资源路径，需在应用启动前显式配置，
// 使 <ion-icon name="..."> 能从 assets/svg 下加载对应 svg。
setAssetPath(document.baseURI);
initialize();

export const ionIconConfigLoaded = true;
