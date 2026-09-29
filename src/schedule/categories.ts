import type { Category, CategoryId } from './types'

// 品目例の出典: 春日井市「資源・ごみの分別と出し方【詳細】」の種類別PDF（2025年4月版）
// https://www.city.kasugai.lg.jp/kurashi/1032702/1032853/1032855/1032955/index.html
//   moyaserugomi202504.pdf / moyasenaigomi202504.pdf / plastic202504.pdf /
//   canbinpet202504.pdf / sinbun202504.pdf / zassizatugami202504.pdf / kinzoku202504.pdf
// 表示の順番はカレンダーPDFの凡例に合わせる
export const CATEGORIES: readonly Category[] = [
  {
    id: 'burnable',
    name: '燃やせるごみ',
    examples: [
      '生ごみ（水切りにご協力ください）',
      'リサイクルできない紙',
      '紙おむつ',
      '革製品・靴',
      'ぬいぐるみ',
      '木の枝',
      '汚れの落ちないプラ容器（マヨネーズ、チューブ、食用油のボトルなど）',
      '30cm以下のプラスチック製品（歯ブラシ、CD、弁当箱、おもちゃなど）',
    ],
  },
  {
    id: 'nonBurnable',
    name: '燃やせないごみ',
    examples: [
      'ガラス、陶器類',
      'ガラスとプラスチックの複合物',
      '電球、割れた蛍光管',
      '汚れが落ちないアルミ箔',
      '使い捨てカイロ',
      '30cm超80cm未満のプラスチック製品（バケツ、衣装ケース、プランターなど）',
    ],
  },
  {
    id: 'plastic',
    name: 'プラスチック製容器包装',
    examples: [
      'トレイ、卵・豆腐・弁当のパック',
      'カップめんやヨーグルトの容器',
      '袋、包装ラップ',
      'ペットボトルのラベル・キャップ',
      '調味料やシャンプー、洗剤のボトル',
      '発泡スチロール、気泡緩衝材',
    ],
  },
  {
    id: 'cansBottles',
    name: '飲料缶、ガラスびん、ペットボトル',
    examples: [
      'スチール製・アルミ製の飲料缶',
      '飲食用や調味料の空きびん（キャップは外す）',
      'PETマークの付いたペットボトル（キャップ・ラベルは外す）',
    ],
  },
  {
    id: 'paperClothes',
    name: '新聞紙、雑誌・雑がみ、段ボール、牛乳パック類、古着',
    examples: [
      '新聞紙・折込チラシ',
      '段ボール',
      '雑誌、雑がみ（菓子箱、封筒、包装紙、カタログなど）',
      '牛乳パック類（開いて乾かす）',
      '古着（着られるもの）',
    ],
  },
  {
    id: 'metal',
    name: '金属類（小型家電、電池類、発火性危険物を含む）',
    examples: [
      '鍋、やかん、フライパン、包丁、傘',
      '小型家電（ドライヤー、炊飯器、ゲーム機、電話など）',
      '飲料缶以外の缶（缶詰、お菓子の缶など）',
      '電池類',
      '発火性危険物（スプレー缶、ガスボンベ、ライター、充電式電池を内蔵した小型家電）',
    ],
  },
]

export const categoryById = (id: CategoryId): Category => {
  const c = CATEGORIES.find((c) => c.id === id)
  if (!c) throw new Error(`unknown category: ${id}`)
  return c
}
