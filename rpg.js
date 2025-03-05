const fs = require('fs');
const Arma = require('./armas.js');

// Classe base com encapsulamento
class Personagem {
    #vida;
    #forca;

    constructor(nome, vida, forca) {
        this.nome = nome;
        this.#vida = vida;
        this.#forca = forca;
    }

    getVida() { return this.#vida; }
    getForca() { return this.#forca; }

    tomarDano(dano) {
        this.#vida -= dano;
        if (this.#vida < 0) this.#vida = 0;
        console.log(`${this.nome} tomou ${dano} de dano. Vida restante: ${this.#vida}`);
    }

    exibirInfo() {
        console.log(`Nome: ${this.nome}, Vida: ${this.#vida}, Força: ${this.#forca}`);
    }

    atacar(alvo) {
        const dano = this.#forca;

        console.log(`${this.nome} realiza um ataque básico causando ${this.#forca} de dano em ${alvo.nome}`);
        alvo.tomarDano(dano);
    }

    // Método para serializar os dados no JSON
    toJSON() { //depois que você define o toJSON, ele é "chamado sozinho" pelo JSON.stringify.
        return {
            nome: this.nome,
            vida: this.#vida,
            forca: this.#forca
        };
    }
}

// Classe Guerreiro
class Guerreiro extends Personagem {
    constructor(nome, vida, forca, arma) {
        super(nome, vida, forca);
        this.arma = arma;
    }

    atacar(alvo) {
        const dano = this.getForca() + this.arma.dano;
        console.log(`${this.nome} ataca ${alvo.nome} com ${this.arma.nome} causando ${dano} de dano!`);
        alvo.tomarDano(dano);
    }

    exibirInfo() {
        console.log(`Nome: ${this.nome}, Vida: ${this.getVida()}, Força: ${this.getForca()}, Arma: ${this.arma.nome}`);
    }

    toJSON() {
        return {
            ...super.toJSON(), // Inclui os dados de Personagem
            arma: this.arma    // Inclui o objeto arma
        };
    }
}

// Classe Inimigo
class Inimigo extends Personagem {
    constructor(nome, vida, forca, ataqueEspecial) {
        super(nome, vida, forca);
        this.ataqueEspecial = ataqueEspecial;
    }

    atacar(alvo) {
        const dano = this.getForca();
        console.log(`${this.nome} usa ${this.ataqueEspecial} em ${alvo.nome} causando ${dano} de dano!`);
        alvo.tomarDano(dano);
    }

    exibirInfo() {
        console.log(`Nome: ${this.nome}, Vida: ${this.getVida()}, Força: ${this.getForca()}, Ataque Especial: ${this.ataqueEspecial}`);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ataqueEspecial: this.ataqueEspecial
        };
    }
}

// Classe InimigoMagico
class InimigoMagico extends Inimigo {
    #mana;

    constructor(nome, vida, forca, ataqueEspecial, mana) {
        super(nome, vida, forca, ataqueEspecial);
        this.#mana = mana;
    }

    getMana() { return this.#mana; }

    usarMagia(custo) {
        if (this.#mana >= custo) {
            this.#mana -= custo;
            return true;
        }
        return false;
    }

atacar(alvo) {
        if (this.usarMagia(10)) {
            const dano = this.getForca() * 2;
            console.log(`${this.nome} lança ${this.ataqueEspecial} com magia em ${alvo.nome}, causando ${dano} de dano!`);
            alvo.tomarDano(dano);
        } else {
            const dano = this.getForca() / 2;
            console.log(`${this.nome} não tem mana suficiente e usa um ataque fraco em ${alvo.nome} causando ${dano} de dano!`);
            alvo.tomarDano(dano);
        }
    }

    exibirInfo() {
        console.log(`Nome: ${this.nome}, Vida: ${this.getVida()}, Força: ${this.getForca()}, Ataque Especial: ${this.ataqueEspecial}, Mana: ${this.#mana}`);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            mana: this.#mana
        };
    }
}

// Lista de personagens
let personagens = [];

function adicionarPersonagem(personagem) {
    personagens.push(personagem);
}

function salvarEmJson(caminho) {
    fs.writeFileSync(caminho, JSON.stringify(personagens, null, 2));
    console.log(`Personagens salvos em: ${caminho}`);
}

// Testes
let espada = new Arma("Espada Longa", 10);
let machado = new Arma("Machado de Guerra", 15);

//
let guerreiro = new Guerreiro("Grok", 100, 20, espada);
let guerreiro2 = new Guerreiro("Magnus", 120, 25, machado);
let inimigo = new Inimigo("Floqui", 80, 15, "Cupir na Cara");
let magico = new InimigoMagico("Bagur", 120, 30, "Fogo Ardente", 40);

adicionarPersonagem(guerreiro);
adicionarPersonagem(guerreiro2);
adicionarPersonagem(inimigo);
adicionarPersonagem(magico);


guerreiro.atacar(inimigo);
guerreiro2.atacar(magico);
inimigo.atacar(guerreiro);
magico.atacar(guerreiro2);

guerreiro2.exibirInfo();
inimigo.exibirInfo();
magico.exibirInfo();
guerreiro.exibirInfo();

salvarEmJson('personagens.json');