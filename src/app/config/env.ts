export class AppConfig {
  public static newUPUrl() {
    return "https://upup.utsource.net";
  }
  public static postUrl() {
    // return 'http://220.231.155.34:8081/cmd/';
    return "https://supp-api.utsource.net/cmd/";
    // return "http://suppapi.utoptic.com/cmd/";
  }
  public static uploadfile() {
    // return 'http://220.231.155.34:8053/uploadfile';
    // return "http://47.52.23.228:3001/uploadfile";
    return `${AppConfig.newUPUrl()}/uploadfile`;
  }
  public static imgUrl() {
    // return 'http://220.231.155.34:8053/m_180x135/';
    return `${AppConfig.newUPUrl()}/m_180x135/`;
  }
}
