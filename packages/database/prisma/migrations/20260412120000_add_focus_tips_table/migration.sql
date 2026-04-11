-- CreateTable
CREATE TABLE `focus_tips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed（表示順は sort_order 昇順で扱う）
INSERT INTO `focus_tips` (`body`, `sort_order`, `created_at`, `updated_at`) VALUES
('最初の 5 分だけ着手する。続きはそのあとで考える。', 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('通知を切るか、画面は 1 タブに絞る。', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('終わりの時間を先に決めてから始める。', 2, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('小さく始める。完璧な準備より最初の一行。', 3, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('休憩はタイマーで区切る。戻る時刻を先に言語化する。', 4, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
