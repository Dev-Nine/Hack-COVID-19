import styled from 'styled-components'

export const Container = styled.div`
   width: 270px;
   height: 372px;
   display: flex;
   flex-direction: column; 
   
   background: #FFFFFF;
   
   border: 1.5px solid #A2A2A2;
   box-sizing: border-box;
   border-radius: 10px;
   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

   img {
      height: 190px;
      border-radius: 10px 10px 0 0;
   }

   div {
      display: flex;
      flex-direction: column;
      margin: 5px 15px 5px 15px;
   }

   div strong {
      margin-top: 15px;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;

   }

   div p {
      margin-top: 7px;
      font-size: 16px;
      line-height: 19px;
      text-align: justify;

      margin-bottom: 15px;

      color: #4A4A4A;
   }

   div span {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;

      text-align: justify;

      color: #787878;
   }

   /* @media (max-width: 1250px) {
      #notice {
         width: 300px;
         background-color: #000;
      }
   } */
`