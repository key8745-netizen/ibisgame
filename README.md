# 《未完成的星路》

給孩子玩的瀏覽器 2D 像素 JRPG。

## 目前開發線

- `main`：乾淨整合基線。
- `agent/playable-slice`：既有 C01「轉運橋救援」技術／玩法原型，與 JRPG 新線分離。
- `docs/game-direction-ssot`：JRPG 設計 SSOT；GD-001～GD-129 已完成，`JRPG Development Baseline v1.0 — IMPLEMENTATION READY`。
- `agent/jrpg-vertical-slice-v1`：目前 JRPG Vertical Slice 實作分支。

## JRPG Vertical Slice

目標流程：

`溪石村 → 舊石坡 → 古石丘 → 石環守衛 → 回到溪石村`

正常首次通關目標約 60–75 分鐘。玩法採經典奇幻 JRPG 文法，故事、角色、怪物、地名、美術與世界觀均為《未完成的星路》原創表現。

## 技術基線

- 瀏覽器優先、靜態部署
- HTML5 Canvas 2D：480×270 邏輯像素遊戲畫面
- DOM：高解析對話、選單與狀態 UI
- 原生 JavaScript ES modules
- 60 Hz fixed-step simulation
- 鍵盤 + 觸控
- versioned localStorage persistence
- Netlify 零建置部署
- 零 runtime dependency

## 工程治理

- `docs/GAME_DIRECTION_SSOT.md` 是設計決策來源。
- LOCKED 語意不得在實作中以「方便」或「tuning」名義改寫。
- C01 的故事、羅盤／光效與救援語意不得被重新解釋成星路系統。
- 實作採小步 milestone、測試、review、preview 後再整合。
