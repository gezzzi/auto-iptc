# IPTC API - Cloud Run Service

画像にIPTCメタデータ（タイトル、タグ、説明）を書き込むAPIサービスです。

## 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `PORT` | サーバーのポート番号（Cloud Runが自動設定） | `8080` |
| `IPTC_API_KEY` | API認証用のキー | `openssl rand -hex 32` で生成 |
| `ALLOWED_ORIGINS` | CORSで許可するオリジン（カンマ区切り） | `https://your-app.vercel.app` |

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## Docker でのビルド・実行

```bash
# ビルド
docker build -t iptc-api .

# 実行
docker run -p 8080:8080 \
  -e IPTC_API_KEY=your-api-key \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  iptc-api
```

## Cloud Run へのデプロイ

### 手動デプロイ

```bash
# Cloud Build でビルド・デプロイ
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_REGION=asia-northeast1,_SERVICE_NAME=iptc-api,_IPTC_API_KEY=your-api-key,_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Cloud Build トリガーの設定

1. GCP Console で Cloud Build トリガーを作成
2. 以下の置換変数を設定:
   - `_REGION`: `asia-northeast1`
   - `_SERVICE_NAME`: `iptc-api`
   - `_IPTC_API_KEY`: APIキー
   - `_ALLOWED_ORIGINS`: 許可するオリジン

## API エンドポイント

### ヘルスチェック

```
GET /health
```

### IPTC書き込み

```
POST /api/iptc/write
```

**Headers:**
- `X-API-Key`: APIキー

**Form Data:**
- `file`: 画像ファイル (JPEG/PNG/WebP)
- `title`: タイトル (オプション)
- `tags`: カンマ区切りのタグ (オプション)
- `description`: 説明 (オプション)

**Response:**
- IPTC情報が書き込まれたJPEG画像

