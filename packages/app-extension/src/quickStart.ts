export {};
(() => {
  const darkMode = true;
  const styleNode = document.createElement("style");
  styleNode.innerHTML = `
      #root,
      body,
      html {
         position: relative;
         width: 100%;
         height: 100%;
         min-height: 600px;
         min-width: 375px;
         margin: 0;
         padding: 0;
         background: ${
           darkMode ? "rgba(10, 10, 10, 1)" : "rgba(244, 244, 246, 1)"
         };
      }
   `;
  document.head.appendChild(styleNode);
})();
