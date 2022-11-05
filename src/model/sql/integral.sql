-- 分享 初始化
UPDATE rabbit_read_card
SET integral = 0;

UPDATE rabbit_read_card
SET integral = 5
WHERE
	(content = '' OR content IS NULL)
AND (imgsStr = '' OR imgsStr IS NULL);

UPDATE rabbit_read_card
SET integral = 15
WHERE
	(
		content != ''
		AND content IS NOT NULL
	)
OR (
	imgsStr != ''
	AND imgsStr IS NOT NULL
);

-- 分享 计算花名积分总和
SELECT
	nick_name,
	sum(maxIntegral) AS sumMaxIntegral
FROM
	(
		SELECT
			nick_name,
			read_card_date,
			max(integral) AS maxIntegral
		FROM
			rabbit_read_card
		WHERE
			nick_name = '后除'
		AND read_card_status = 1
		GROUP BY
			read_card_date
	) AS A;

-- 笔记 初始化
UPDATE rabbit_read_wiki
SET integral = 0;

UPDATE rabbit_read_wiki
SET integral = 30
WHERE
	content != ''
AND content IS NOT NULL;

-- 笔记 计算花名积分总和
SELECT
	nick_name,
	sum(integral) AS sumIntegral
FROM
	(
		SELECT
			nick_name,
			book_name,
			integral
		FROM
			rabbit_read_wiki
		WHERE
			nick_name = '后除'
		AND read_wiki_status = 1
		GROUP BY
			book_name
	) AS A;

