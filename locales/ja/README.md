# Skyrim Control Mapper

## 概要

[English README / 英語版はこちら](https://github.com/NONONOexe/skyrim-control-mapper/blob/main/README.md)

Skyrim Control Mapperは「The Elder Scrolls V: Skyrim」のキーマッピングをGUIで簡単に編集できるウェブアプリケーションです。

Skyrimでは、ゲーム内のオプションでキー設定ができますが、コントローラーのボタンの組み合わせなど、より詳細な設定には、ゲームディレクトリ内の`controlmap.txt`ファイルを直接編集する必要があります。しかし、このファイルはタブ区切りかつ16進数で記述されており、手動での編集は非常に困難です。また、誤った形式で保存するとゲームが起動しなくなる原因にもなります。

このアプリケーションでは、この`controlmap.txt`を直感的で安全に編集するためのビジュアルエディタを提供します。

## 特徴

- `controlmap.txt`を視覚的に編集できるユーザーインターフェース
- Skyrimのデフォルト設定（新旧バージョン対応）を読み込む機能
- ゲームパッド、キーボード、マウスの操作デバイスに対応
- 一つの操作に対する複数のキーの割り当て、キーの組み合わせによる割り当てが可能

## 使い方

以下の3つのステップで、`controlmap.txt`を編集できます。

### ステップ 1: `controlmap.txt`ファイルの準備

編集対象となる`controlmap.txt`ファイルは、通常以下の場所にあります。

```txt
[Skyrimのゲームディレクトリ]\Data\Interface\Controls\PC\controlmap.txt
```

このファイルを別の任意の場所へコピーしておいてください。

### ステップ 2: アプリケーションでの編集

[Skyrim Control Mapper](https://nononoexe.github.io/skyrim-control-mapper/)にアクセスし、以下の手順で編集します。

1. **設定ファイルの読み込み**:
   コピーしておいた`controlmap.txt`をアップロードします。または、適用先のSkyrimのバージョンに合わせたデフォルト設定を選択して読み込むこともできます（バージョン1.6.640以降は「新バージョン」、それ以前は「旧バージョン」を選択してください）。

    ![設定ファイルの読み込み](https://github.com/NONONOexe/skyrim-control-mapper/blob/main/images/load-config.png)

2. **キーマッピングの編集**:
   表示された操作項目に対して、ゲームパッド、キーボード、マウスのキーを割り当ててください。複数のキーを割り当てることもできます。

    ![キーマッピングの編集](https://github.com/NONONOexe/skyrim-control-mapper/blob/main/images/edit-mapping.png)

3. **設定ファイルのダウンロード**:
   編集が完了したら、ボタンをクリックして、編集後の`controlmap.txt`ファイルをダウンロードしてください。

    ![設定ファイルのダウンロード](https://github.com/NONONOexe/skyrim-control-mapper/blob/main/images/download-config.png)

### ステップ 3: ゲームへの適用

ダウンロードした`controlmap.txt`ファイルを、ステップ 1で確認した元の場所（`[Skyrimのゲームディレクトリ]\Data\Interface\Controls\PC\`）に上書き保存してください。

これでSkyrim起動時に新しいキーマッピングが適用されます。

## 始める前に - 重要な注意

- **必ず`controlmap.txt`ファイルのバックアップを取ってください！** 本アプリケーションには不具合が含まれている可能性があります。アップロードしたファイルの内容が失われたり、想定と異なるキーが割り当てられるリスクがあります。`controlmap.txt`は必ずバックアップしておいてください。
- 本アプリケーションの使用は自己責任でお願いします。

## 問題の報告や改善の提案

本アプリケーションに関する不具合の報告や、改善に関する提案を歓迎します。[Issues](https://github.com/NONONOexe/skyrim-control-mapper/issues)にご報告ください。

不具合を報告いただく際には、状況把握のために、問題が発生した`controlmap.txt`ファイル（編集前と編集後の両方があればより助かります）を添付していただけると調査がスムーズに進みます。

## クレジット

本アプリケーションは、Hawkbat氏によって作成された[SkyrimControlMapper](https://github.com/Hawkbat/SkyrimControlMapper)を元に開発されました。この素晴らしい元プロジェクトに感謝いたします。

## ライセンス

本アプリケーションはMITライセンスのもとで公開されています。詳細については、リポジトリに含まれる[LICENSEファイル](https://github.com/NONONOexe/skyrim-control-mapper/blob/main/LICENSE)をご確認ください。
