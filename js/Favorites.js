// dados da API
import { GithubUser } from './Api.js'


//Classe que vai fazer o tratamento de dados

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root) 
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    }

    save(){
        localStorage.setItem('favoriteUsers', JSON.stringify(this.entries))
    }

    async add(username){

        try {
            const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase());

            if(userExists){
                throw new Error(`Usuário ${username.login} já existe!`)
            }

            const user = await GithubUser.search(username)
            
            if(user.login === undefined){
                throw new Error(`Usuário ${user.login} não encontrado!`)
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert('Desculpe! '+ error.message)
        }

    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries
        this.update()
        this.save()

    }
}



//Classe que vai fazer os eventos e renderização da view

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')
       this.update()
       this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update(){
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow(user);
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('a.user').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.action').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)

        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td >
        <a href="https://github.com/maykbrito" class="user" target="_blank">
        <img src="https://github.com/maykbrito.png" alt="">
        <div class="user-info">
            <p>Mayk Brito</p>
            <span>/maykbrito</span>
        </div>
        </a>
        </td>

        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td class="action">Remover</td>
        `

        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tbody tr').forEach(tr => tr.remove())
    }
}