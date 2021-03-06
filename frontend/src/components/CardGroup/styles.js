import styled from 'styled-components';

export const Container = styled.div`
   margin-bottom: 30px;

   div a {
      color: var(--main-ref-color);
      font-size: 22px;
      text-decoration: none;
      float: right;
   }

   div a:hover {
      text-decoration: underline;
   }

   h1 {
      font-size: 26px;
      color: var(--main-text-color);
   }

   hr {
      width: 210px;
      height: 5px;

      background: var(--main-text-color);

      border: 0;
      border-radius: 0px 10px 10px 0px;
   }

   ul {
      margin-top: 15px;
      margin-bottom: 15px;

      display: grid;
      grid-template-columns: repeat(4, minmax(200px, 300px));
      gap: 2rem;

      list-style: none;
   }

   li {
      background: #fff;
      border-radius: 8px;
   }

   @media (max-width: 1099px) {
      ul {
         grid-template-columns: repeat(1, 1fr);
      }
   }
`;
