import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';

import { FiCornerDownRight } from 'react-icons/fi';

import { Container } from './styles';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Faq() {
   useEffect(() => {
      document.title = 'Dúvidas Frequentes';
   });

   return (
      <>
         <Header />

         <div className="main">
            <Container>
               <h1>Dúvidas frequentes</h1>
               <ul>
                  <li>
                     <Link to="/faq/covid19">
                        <h2>
                           <FiCornerDownRight />
                           Informações sobre o novo corona vírus
                        </h2>
                     </Link>
                  </li>
               </ul>
            </Container>
         </div>

         <Footer />
      </>
   );
}
