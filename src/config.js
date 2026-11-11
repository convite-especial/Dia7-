export const config = {
  title: 'Não foi coincidência.',
  startDate: '2023-12-07',
  anniversaryDate: '2026-12-07',
  ending: 'anniversary', // 'anniversary' ou 'proposal' — altere somente quando decidir
  names: { him: 'Ele', her: 'Ela' },
  chapters: [
    { title: 'Não foi coincidência.', eyebrow: 'UMA HISTÓRIA ESCRITA COM CARINHO', text: 'Algumas histórias começam com um encontro marcado. A nossa começou com caminhos que insistiam em se cruzar.' },
    { title: 'A feira e os encontros', eyebrow: 'CAPÍTULO 01', text: 'Primeiro, na feira. Depois, em outro emprego. E, quando menos esperávamos, lá estávamos nós de novo.' },
    { title: 'Chuva e milk-shake', eyebrow: 'CAPÍTULO 02 · 07.12.2023', text: 'Naquele dia choveu. E, entre um milk-shake e outro, começou uma das minhas lembranças favoritas.' },
    { title: 'Nossa coleção de instantes', eyebrow: 'CAPÍTULO 03', text: 'Não lembro de todos os dias. Mas sei que cada um deles ajudou a construir o nosso nós.' },
    { title: 'O que ainda vem', eyebrow: 'CAPÍTULO 04', text: 'De todos os caminhos possíveis, agradeço a Deus por ter encontrado você.' },
  ],
  photos: Array.from({ length: 30 }, (_, i) => ({ src: `/fotos/${String(i+1).padStart(2,'0')}.jpg`, caption: `Nossa lembrança ${i+1}` })),
};
