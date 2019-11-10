module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Multi SSH Client",
        copyright: "Copyright © 2019 ${author}",
        win: {
          icon: "./src/assets/logo_512x512.png",
        },
        dmg: {
          title: "${productName}"
        }
      }
    }
  }
}
