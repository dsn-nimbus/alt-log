/**
 * Lib responsável por realizar o log das informações com base nas configurações
 * informadas.
 * @type {AltLog}
 */
class AltLog {

  /**
   * Configurações padrão de monitoramento do alt-log
   * @type {Object}
   */
  static get defaultConfig() {
    return {
      dev: {
        tiposMonitorados: ['info', 'debug', 'error'],
        logData: true,
        logHora: true
      },
      hml: {
        tiposMonitorados: ['debug', 'error'],
        logData: true,
        logHora: true
      },
      prod: {
        tiposMonitorados: ['error'],
        logData: true,
        logHora: true
      }
    };
  }

  /**
   * Define as configurações a serem utilizadas pelo alt-log
   * @param {object} config configurações desejadas
   */
  static setConfig(config) {
    this._config = config || this.defaultConfig;
  }

  /**
   * Obtém as configurações atuais do alt-log
   * @return {object} configurações atuais
   */
  static get config() {
    return this._config || this.defaultConfig;
  }

  static report() {

  }

  // TODO: Implementar método de gravação do log. O método deve receber os parâmetros e cadastrá-los
  // na fila de mensagens do alt-log. Esta fila irá tratá-los com base nas configs selecionadas.
  static record(report) {
    report = {
      data: new Date().get,

    };
  }
}
