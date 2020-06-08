import React, { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'

import data from './test.md'

import Header from '../../components/Header'
import CoronaCard from '../../components/CoronaCard'
import Comment from '../../components/Comment'

import { ContainerNoticia, ContainerComentario, EscreverComentario, MarkdownContainer } from './styles'

export default function NoticeDisplay() {

    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(data)
        .then(res => res.text())
        .then(md => {
            setContent(md);
        })
    }, []);

    return(
        <>
            <Header />
            <div className='main'>
                <CoronaCard />
                <ContainerNoticia>
                    <div>
                        <h1>Como lavar as mãos</h1>
                        <p>Nessa epóca de pandemia, é extramente necessário lavar as mãos!</p>
                        <p>Escrito por Leandro R. - 1 de abril de 2020,</p>
                        <MarkdownContainer>
                            <Markdown>
                                {content}
                            </Markdown>
                        </MarkdownContainer>
                    </div>
                </ ContainerNoticia>
                
                <ContainerComentario>
                    <h1>Comentários</h1>
                    <Comment 
                        name="Gustavo Patara" 
                        content="Somente álcool em gel é eficaz?"
                    />
                    <form>
                        <EscreverComentario>
                            <h2>Escreva seu comentário</h2>
                            <textarea placeholder="Escreva seu comentário aqui"/>
                            <button>Enviar</button>
                        </EscreverComentario>
                    </form>
                </ ContainerComentario>
            </div>
            
        </>
    )
}