import React, { useState } from 'react';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FiX, FiSearch, FiPlus } from 'react-icons/fi';
import useSWR from 'swr';

import { confirmAlert } from 'react-confirm-alert'; // Import element
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import api from '../../../services/api';

import { Container, Table, TableLine, Button } from './styles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../hooks/AuthProvider';
import PageSelector from '../../../components/PageSelector';

async function loadNotices(url, setTotalCount, setIsLoading) {
    try {
        const res = await api.get(url);
        setTotalCount(Number(res.headers['x-total-count']));
        return res.data;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        setIsLoading(false);
    }
}

export default function Panel() {
    const { user } = useAuth();
    const [totalCount, setTotalCount] = useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { data: notices, mutate } = useSWR(
        [
            user.type === 0
                ? '/notices'
                : `/notices/?userid=${user.id}&page=${page}`,
            setTotalCount,
            setIsLoading,
        ],
        loadNotices,
    );

    useEffect(() => {
        document.title = 'Painel de controle';
    });

    function remove(id) {
        confirmAlert({
            title: 'Confirme a exclusão',
            message: 'Você tem certeza que deseja excluir?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        api.delete(`/notices/${id}`);
                        const updatedNotices = notices.filter((notice) => {
                            if (notice.id !== id) return true;
                            return false;
                        });
                        mutate(updatedNotices, false);
                    },
                },
                {
                    label: 'Não',
                },
            ],
        });
    }

    return (
        <>
            <Header />
            <div className="main">
                <Container>
                    <h1>Painel de Noticias</h1>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : (
                        <Table>
                            <PageSelector
                                totalCount={totalCount}
                                currentPage={page}
                                setCurrentPage={setPage}
                                itemsPerPage={8}
                            />
                            <TableLine isHeader>
                                <div> Titulo </div>
                                <div> Data </div>
                                <div> Autor </div>
                                <div>
                                    <Link to="create">
                                        <Button isCreate>
                                            <FiPlus />
                                        </Button>
                                    </Link>
                                </div>
                            </TableLine>
                            {notices ? (
                                notices.map((n) => (
                                    <TableLine key={n.id}>
                                        <div id="noOverflow">{n.title}</div>
                                        <div>
                                            {new Date(
                                                n.date,
                                            ).toLocaleDateString()}
                                        </div>
                                        <div>{n.user.name}</div>
                                        <div>
                                            <Link to={`edit/${n.id}`}>
                                                <Button>
                                                    <FiSearch />
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => {
                                                    remove(n.id);
                                                }}
                                                isDelete
                                            >
                                                <FiX />
                                            </Button>
                                        </div>
                                    </TableLine>
                                ))
                            ) : (
                                <div> Não há notícias... </div>
                            )}
                        </Table>
                    )}
                </Container>
            </div>

            <Footer />
        </>
    );
}
