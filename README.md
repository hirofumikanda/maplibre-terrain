# MapLibre 地形可視化

MapLibre GL JSを使用した地形データの可視化アプリケーションです。複数のDEM（数値標高モデル）データソースとカスタムプロトコルハンドラーを組み合わせて、日本の地形を3D表示できます。

## 特徴

- **複数の地形データソース対応**
  - 地理院標高タイル（GSI DEM）
  - PMTiles形式のローカル地形データ
  - AWS Terrain データ
- **地形強調スライダー**：リアルタイムで地形の起伏を調整可能
- **カラーリリーフ**：標高に応じた色分け表示
- **ヒルシェード効果**：立体感のある地形表現

## 開発環境

```bash
# リポジトリをクローン
git clone https://github.com/hirofumikanda/maplibre-terrain.git
cd maplibre-terrain

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## 技術仕様

### アーキテクチャ

- **フロントエンド**: React 19 + TypeScript
- **地図ライブラリ**: MapLibre GL JS
- **地形データ**: PMTiles形式、地理院標高タイル
- **ビルドツール**: Vite
- **デプロイ**: GitHub Pages

### データソース

1. **地理院標高タイル**: 国土地理院が提供するDEMデータ
2. **PMTiles**: 効率的なタイル配信形式でのローカル地形データ
3. **AWS Terrain**: Terrariumエンコーディング形式の世界地形データ

### カスタムプロトコル

- `gsidem://`: 地理院DEMタイルをTerrain RGB形式に変換
- `pmtiles://`: PMTilesファイルへのアクセス

## ファイル構成

```
src/
├── components/
│   ├── MapComponent.tsx      # メイン地図コンポーネント
│   └── ExaggerationSlider.tsx # 地形強調スライダー
├── hooks/
│   ├── useGsidemProtocol.ts  # GSI DEMプロトコル登録
│   └── usePmtilesProtocol.ts # PMTilesプロトコル登録
└── utils/
    └── gsidem.ts             # GSI DEM形式変換ユーティリティ

public/
├── styles/
│   └── style.json            # MapLibre スタイル定義
└── dem/
    └── *.pmtiles             # 地形データファイル
```

## ライセンス

MIT License
※地形データは各データソースのライセンスに従います。