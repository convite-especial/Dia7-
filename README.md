# Não foi coincidência ❤️

Protótipo funcional de uma experiência romântica 3D para celular.

## Iniciar

1. Instale Node.js 20.19+ ou 22.12+.
2. Abra a pasta no VS Code.
3. No terminal: `npm install`
4. Rode: `npm run dev`
5. Abra o endereço mostrado no terminal.

## Personalizar

- `src/config.js`: textos, data, nomes, lista de fotos e final.
- `public/fotos/`: coloque as imagens `01.jpg` até `30.jpg` (ou edite a lista em config.js).
- `ending: 'anniversary'` mantém o final romântico; `ending: 'proposal'` mostra o pedido. Só mude quando decidir.
- Os personagens atuais são modelos geométricos 3D temporários; serão substituídos por modelos personalizados.
- O botão de som gera chuva suave localmente, sem arquivo externo. Música não incluída por direitos autorais.

## Publicação

Rode `npm run build` e publique a pasta `dist` em uma hospedagem estática como Vercel ou Netlify. Crie o QR Code somente depois de confirmar a URL definitiva. Guarde uma cópia do projeto e das fotos.

## Observações

Esta é uma primeira versão jogável, não a versão final. Ainda faltam cenários completos, animações de caminhada com esqueleto, modelos personalizados, legendas reais e trilha licenciada.
