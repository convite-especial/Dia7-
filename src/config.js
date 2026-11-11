export const config = {
  title: 'Não foi coincidência.',
  startDate: '2023-12-07',
  anniversaryDate: '2026-12-07',
  ending: 'anniversary', // 'anniversary' ou 'proposal' — altere somente quando decidir
  names: { him: 'Ele', her: 'Ela' },
  chapters: [
    {title:'Não foi coincidência.',eyebrow:'PRÓLOGO',text:'Algumas histórias começam com um encontro marcado. A nossa começou com caminhos que insistiam em se cruzar.'},
    {title:'Dois caminhos',eyebrow:'CAPÍTULO 01',text:'Antes de nós dois, existiam duas vidas seguindo em frente. Sem imaginar que, em algum lugar, Deus preparava um encontro.'},
    {title:'A menina da feira',eyebrow:'CAPÍTULO 02',text:'Eu trabalhava na feira. Você aparecia de vez em quando. Na época, parecia apenas mais um encontro entre tantos.'},
    {title:'Lá estava você de novo',eyebrow:'CAPÍTULO 03',text:'Troquei de emprego e, quando menos esperava, você apareceu lá para comer. Coincidência? Talvez a vida já soubesse de alguma coisa.'},
    {title:'Os encontros sem combinar',eyebrow:'CAPÍTULO 04',text:'Em lugares aleatórios, nossos caminhos continuavam se cruzando. Hoje gosto de pensar que Deus estava cuidando dos detalhes.'},
    {title:'A chuva daquele dia',eyebrow:'CAPÍTULO 05',text:'Nosso primeiro encontro teve chuva. E, de alguma forma, todo 7 de dezembro parece querer lembrar a gente daquele começo.'},
    {title:'Um milk-shake e nós dois',eyebrow:'CAPÍTULO 06 · 07.12.2023',text:'Não foi um encontro perfeito de cinema. Foi melhor: foi nosso. Um milk-shake, a chuva e uma memória que nunca saiu de mim.'},
    {title:'Os pequenos instantes',eyebrow:'CAPÍTULO 07',text:'A beleza da nossa história também mora nas coisas simples: conversas, sorrisos, passeios e dias comuns que ficaram especiais.'},
    {title:'Nem sempre faz sol',eyebrow:'CAPÍTULO 08',text:'Se a chuva fez parte do começo, que ela também lembre que não precisamos de dias perfeitos para continuar caminhando juntos.'},
    {title:'Nossa coleção de memórias',eyebrow:'CAPÍTULO 09',text:'Aqui vamos guardar nossas fotos, uma de cada vez. Porque algumas lembranças merecem ter um lugar só delas.',gallery:true},
    {title:'Três anos depois',eyebrow:'CAPÍTULO 10 · 07.12.2026',text:'De todos os caminhos possíveis, agradeço a Deus por ter encontrado você. E ainda quero descobrir tantos outros ao seu lado.',ending:true},
  ],
  photos: Array.from({ length: 30 }, (_, i) => ({ src: `${import.meta.env.BASE_URL}fotos/${String(i+1).padStart(2,'0')}.jpg`, caption: `Nossa lembrança ${i+1}` })),
};
