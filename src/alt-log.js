/**
 * Lib responsável por realizar o log das informações com base nas configurações
 * informadas.
 * @type {altLog}
 */
const altLog = (function() {
  "use strict";

  return {
    // TODO: Implementar histórico usando Map ao invés de Set
    _reportHistory: new Set(),
    _historyMaxSize: 1000,

    /**
     * Configurações padrão de monitoramento do alt-log
     * @type {Object}
     */
    get defaultConfig() {
      return {
        dev: {
          tiposMonitorados: ['info', 'debug', 'error'],
          logData: true,
          logHora: true,
          quiet: false
        },
        hml: {
          tiposMonitorados: ['debug', 'error'],
          logData: true,
          logHora: true,
          quiet: false
        },
        prod: {
          tiposMonitorados: ['error'],
          logData: true,
          logHora: true,
          quiet: true
        }
      };
    },

    /**
     * Ambiente padrão de execução do alt-log
     * @type {string}
     */
    get defaultEnv() {
      return "prod";
    },

    /**
     * Obtém o padrão de conteúdo de um report
     * @return {object}
     */
    get contentPattern() {
      let pattern = {
        tipo: 'info',
        data: undefined,
        hora: undefined,
        msg: undefined,
        obj: undefined
      };

      let currentDate = new Date();
      pattern.data = !!this.config[this.env].logData ?
        currentDate.getDay() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() :
        undefined;
      pattern.hora = !!this.config[this.env].logHora ?
        currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() :
        undefined;

      return pattern;
    },

    /**
    * Obtém as configurações atuais do alt-log
    * @return {object} configurações atuais
    */
    get config() {
      return this._config || this.defaultConfig;
    },

    /**
     * Obtém o ambiente atual do alt-log
     * @type {string}
     */
    get env() {
      return this._env || this.defaultEnv;
    },

    /**
    * Define as configurações a serem utilizadas pelo alt-log
     * @param {object} config configurações desejadas
     */
    setConfig(config) {
      this._config = config || this.defaultConfig;
    },

    /**
     * Define o ambiente de execução do alt-log
     * @param {string} env ambiente desejado
     */
    setEnv(env) {
      this._env = env || this.defaultEnv;
    },

    /**
     * Define um valor máximo de reports a serem registrados no histórico
     * @param {integer} value nova quantidade máxima de reports
     */
    setHistoryMaxSize(value) {
      this._historyMaxSize = value || this._historyMaxSize;
    },

    /**
     * Cria um report
     * @param  {object} content conteúdo do report
     */
    report(content) {
      let outputContent = this.contentPattern;
      outputContent.tipo = !content.tipo ? outputContent.tipo : content.tipo;
      outputContent.msg = !content.msg ? outputContent.msg : content.msg;
      outputContent.obj = !content.obj ? outputContent.obj : content.obj;

      this._addHistory(outputContent);
      this._filter(outputContent);
    },

    /**
     * Obtém o histórico de reports
     * @return {Set} histórico de reports
     */
    printHistory() {
      for (let report of this._reportHistory) {
        this._output(this._formatReport(report), report.obj);
      }
    },

    /**
     * Filtra os reports com base nas configurações do alt-log e no ambiente
     * @param  {object} report report a ser filtrado
     */
    _filter(report) {
      if (this.config[this.env].tiposMonitorados.indexOf(report.tipo) > -1) {
        if (!this.config[this.env].quiet) {
            let formattedReport = this._formatReport(report);
            this._output(formattedReport, report);
        }
      }
    },

    /**
     * Escreve o report no destino configurado no alt-log.
     * @param  {object} report conteúdo da escrita
     * @param  {object} obj    objeto anexado ao report
     */
    _output(report, obj) {
      if (!!obj) {
        console.log(report, obj);
      } else {
        console.log(report);
      }
    },

    /**
     * Adiciona report ao histórico.
     * Caso o histórico esteja com o limite de reports alcançado, o report mais antigo será
     * removido para dar lugar ao mais novo.
     * @param  {object} report report a ser armazenado
     */
    _addHistory(report) {
      if (this._reportHistory.size === this._historyMaxSize) {
        this._unclutterHistory();
      }
      this._reportHistory.add(report);
    },

    /**
     * Limpa o primeiro item do histórico
     */
    _unclutterHistory() {
      var array = Array.from(this._reportHistory);
      array.shift();
      this._reportHistory = new Set(array);
    },

    /**
     * Formata um report visualmente
     * @param  {object} report report a ser formatado
     * @return {string}        report formatado
     */
    _formatReport(report) {
      let dataSct = !report.data ? "" : report.data + " ";
      let horaSct = !report.hora ? "" : report.hora + " ";
      let tipoSct = "|| " + report.tipo.toUpperCase() + " || ";
      let msgSct = !report.msg ? "" : "Descrição: " + report.msg;
      return dataSct + horaSct + tipoSct + msgSct;
    }
  };
}());
