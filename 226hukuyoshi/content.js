// 店舗確認後の差し替え情報をここで管理します。
window.SHOP = {
  address: '〒990-0834 山形県山形市清住町2丁目4−34',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('麺屋 福よし 山形県山形市清住町2丁目4-34'),
  menu: [
    {name:'中華そば',en:'CHUKA SOBA',price:850,category:'shoyu',tag:'福よしの看板',description:'澄んだ醤油スープと細めの縮れ麺。初めての方にも選んでいただきたい、定番の一杯。',image:'assets/ramen-hero.webp',alt:'醤油味の中華そばのAI生成イメージ'},
    {name:'みそらーめん',en:'MISO RAMEN',price:900,category:'miso',tag:'',description:'すっきりとした味噌仕立てのスープ。細めの縮れ麺と一緒に、味噌の風味を楽しむ一杯。'},
    {name:'からみそらーめん',en:'KARAMISO RAMEN',price:950,category:'miso',tag:'',description:'味噌らーめんに辛味噌を添えて。少しずつ溶かしながら、お好みの辛さに。'},
    {name:'チャーシュー麺',en:'CHASHU RAMEN',price:1100,category:'shoyu',tag:'',description:'中華そばに特製チャーシューを5枚。お肉もしっかり味わいたい日に。'},
    {name:'つけめん',en:'TSUKEMEN',price:800,category:'tsuke',tag:'小盛の価格',description:'特製のつけダレに、細めの縮れ麺をくぐらせて。つけめんならではの味わいを。'}
  ]
};
