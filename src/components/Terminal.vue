<template>
  <div ref="terminal"></div>
</template>

<script>
const Terminal = require("xterm").Terminal;
const FitAddon = require("xterm-addon-fit").FitAddon;
const { clipboard } = require('electron')

// --------------------------------------

export default {
  name: "Terminal",
  data() {
    return {
      term: new Terminal()
    };
  },
  props: {
    conn: Object
  },
  methods: {
    resize(term) {
      //col 1 = 9px
      //row 1 = 17px
      var heigt = term.element.offsetHeight;
      var width = term.element.offsetWidth - 32;

      var rowCount = Math.floor(heigt / 17);
      var colCount = Math.floor(width / 9);

      term.resize(colCount, rowCount);
    }
  },
  mounted() {
    // 
    const term = this.term;
    const conn = this.conn;
    const app = this;
    const frame = this.$refs["terminal"];
    //

    const fit = new FitAddon();
    term.loadAddon(fit);

    term.open(frame);
    term.resize(50, 25);
    app.resize(term);
    //

    conn.shell(
      { term: "xterm-256color", cols: term.cols, rows: term.rows },
      function(err, stream) {
        if (err) throw err;

        stream.on("close", function() {
          conn.end();
          app.$emit("quit");
        });

        stream.on("data", function(data) {
          if (data.toString().charCodeAt() == 7) {
            app.$emit("bell");
          }

          term.write(data);
        });

        term.onKey(e => {
          stream.write(e.key);
        });

        term.onSelectionChange(function() {
          clipboard.writeText(term.getSelection());
        });

        frame.addEventListener("contextmenu", function() {
          stream.write(clipboard.readText());
        });

        let resizeTimer;

        window.addEventListener("resize", function() {
          var oldSize = {
            cols: term.cols,
            rows: term.rows
          };

          app.resize(term);

          clearInterval(resizeTimer);
          resizeTimer = setTimeout(function() {
            if (oldSize.cols != term.cols || oldSize.rows != term.rows) {
              stream.setWindow(term.rows, term.cols);
            }
          }, 250);
        });
      }
    );
  }
};
</script>

<style>
@import "../../node_modules/xterm/css/xterm.css";
</style>