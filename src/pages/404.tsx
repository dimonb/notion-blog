/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";
import React from "react";
import Link from "next/link";

const Custom404Styles = styled.div`
  justify-content: center;
  text-align: center;
  height: 80vh;
  text-align: center;
  display: flex;
  align-items: center;

  .delimiter {
    display: inline-block;
  }
  
  h1 {
    display: inline-block;
    font-family: doloman, sans-serif;
    font-size: 4rem;
    font-weight: 100;
    color: var(--C4);
    border-right: 0.1rem solid;
    padding-right: var(--spacing-md);
    border-top: var(--spacing-md);
    line-height: 5.5rem;
    text-shadow: rgba(0, 0, 0, 0.3) 0px 1px 1px;
  }

  h2 {
    padding-left: var(--spacing-md);
    font-family: doloman, sans-serif;
    font-size: 4rem;
    font-weight: 100;
  }

  img {
    padding-right: var(--spacing-md);
    width: 4.3rem;
  }

  @media screen and (max-width: 744px) {
    h1 {
        line-height: 4rem;
        border-right: none;
        padding-bottom: var(--spacing-md);
    }
  }
`;



const Custom404 = () => {
  return (
    <Custom404Styles>
      <div>
        <div className="box">
          <Link href="/">
            <img src="/favicon.svg" alt="404" width="35px" />
            <h1>404</h1>
            <div className="delimiter">
              <h2>Page Not Found</h2>
            </div>
          </Link>
        </div>
      </div>
    </Custom404Styles>
  );
};

export default Custom404;
