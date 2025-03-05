class Arma
{
    constructor(nome, dano)
    {
        this.nome = nome;
        this.dano = dano;
    }

    exibirInfo()
    {
        console.log(`arma: ${this.nome}, dano: ${this.dano}`);

    }
}

module.exports = Arma; //exportar a classe armas para que possa ser acessada por um require