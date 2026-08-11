/*
# DroidZyra — Demo Data Seed

Inserts clearly labeled demo records for testing:
- 9 categories
- 8 demo apps (across all categories)
- 22 versions
- 22 changelogs
- 67 compatibility records
- 16 screenshots

All source URLs use example.com placeholders — these are NOT real download links.
*/

-- Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('11111111-0000-0000-0000-000000000001','Social','social','Social networking and community apps'),
  ('11111111-0000-0000-0000-000000000002','Communication','communication','Messaging, VoIP and communication tools'),
  ('11111111-0000-0000-0000-000000000003','Music','music','Music streaming, players and audio tools'),
  ('11111111-0000-0000-0000-000000000004','Video','video','Video streaming, players and editors'),
  ('11111111-0000-0000-0000-000000000005','Productivity','productivity','Notes, tasks and productivity tools'),
  ('11111111-0000-0000-0000-000000000006','Photography','photography','Camera, photo editing and gallery apps'),
  ('11111111-0000-0000-0000-000000000007','Education','education','Learning, language and study apps'),
  ('11111111-0000-0000-0000-000000000008','Tools','tools','Utilities, developer tools and system apps'),
  ('11111111-0000-0000-0000-000000000009','Games','games','Mobile games and entertainment')
ON CONFLICT (slug) DO NOTHING;

-- Apps (8 demo apps)
INSERT INTO apps (id, name, slug, developer, package_name, description, category_id, icon_url, official_url, status) VALUES
  ('22222222-0000-0000-0000-000000000001','ChatterBox','chatterbox','ChatterBox Inc.','com.chatterbox.social','A social networking app for communities, groups and real-time conversations.','11111111-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1611605698335-8b1569810432?w=128&h=128&fit=crop','https://example.com/chatterbox','active'),
  ('22222222-0000-0000-0000-000000000002','SignalTalk','signaltalk','SignalTalk Foundation','com.signaltalk.messenger','Privacy-focused messaging with end-to-end encryption and open-source protocols.','11111111-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1611605698335-8b1569810432?w=128&h=128&fit=crop','https://example.com/signaltalk','active'),
  ('22222222-0000-0000-0000-000000000003','WaveTunes','wavetunes','WaveTunes Media','com.wavetunes.player','A music player with high-res audio support, equalizer and offline playback.','11111111-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=128&h=128&fit=crop','https://example.com/wavetunes','active'),
  ('22222222-0000-0000-0000-000000000004','ClipStream','clipstream','ClipStream Labs','com.clipstream.video','Video streaming and player app with subtitle support and picture-in-picture mode.','11111111-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1574375927938-d5a98e8ffe7a?w=128&h=128&fit=crop','https://example.com/clipstream','active'),
  ('22222222-0000-0000-0000-000000000005','NoteNest','notenest','NoteNest Software','com.notenest.notes','A clean note-taking app with markdown support, tags and cross-device sync.','11111111-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1517842645767-c639042777db?w=128&h=128&fit=crop','https://example.com/notenest','active'),
  ('22222222-0000-0000-0000-000000000006','SnapLight','snaplight','SnapLight Studio','com.snaplight.camera','A lightweight camera app with manual controls, RAW capture and clean editing tools.','11111111-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1500627964684-13335fc86582?w=128&h=128&fit=crop','https://example.com/snaplight','active'),
  ('22222222-0000-0000-0000-000000000007','LinguaLab','lingualab','LinguaLab Education','com.lingualab.learn','Learn languages with spaced-repetition flashcards, audio lessons and offline access.','11111111-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1453733190371-0a90364e2113?w=128&h=128&fit=crop','https://example.com/lingualab','active'),
  ('22222222-0000-0000-0000-000000000008','DevKit Tools','devkit-tools','DevKit Labs','com.devkit.tools','A toolbox for developers: network utilities, JSON inspector, regex tester and log viewer.','11111111-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&h=128&fit=crop','https://example.com/devkit-tools','active')
ON CONFLICT (slug) DO NOTHING;

-- Versions for ChatterBox
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000011','22222222-0000-0000-0000-000000000001','5.2.1','52100','2026-07-15','8.0','14','arm64-v8a',42000000,'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90','https://example.com/chatterbox/v5.2.1','official',true),
  ('33333333-0000-0000-0000-000000000012','22222222-0000-0000-0000-000000000001','5.1.0','51000','2026-03-22','8.0','13','arm64-v8a',39800000,'b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1','https://example.com/chatterbox/v5.1.0','official',true),
  ('33333333-0000-0000-0000-000000000013','22222222-0000-0000-0000-000000000001','4.9.8','49800','2025-09-10','6.0','12','universal',36500000,'c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2','https://example.com/chatterbox/v4.9.8','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for SignalTalk
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000021','22222222-0000-0000-0000-000000000002','7.4.0','70400','2026-07-28','7.0','14','arm64-v8a',89000000,'d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3','https://example.com/signaltalk/v7.4.0','official',true),
  ('33333333-0000-0000-0000-000000000022','22222222-0000-0000-0000-000000000002','7.2.1','72100','2026-01-15','7.0','13','arm64-v8a',85200000,'e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4','https://example.com/signaltalk/v7.2.1','official',true),
  ('33333333-0000-0000-0000-000000000023','22222222-0000-0000-0000-000000000002','6.8.0','68000','2025-06-05','5.0','11','universal',78100000,'f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5','https://example.com/signaltalk/v6.8.0','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for WaveTunes
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000031','22222222-0000-0000-0000-000000000003','3.7.2','37200','2026-07-05','9.0','14','arm64-v8a',31500000,'0718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6','https://example.com/wavetunes/v3.7.2','official',true),
  ('33333333-0000-0000-0000-000000000032','22222222-0000-0000-0000-000000000003','3.5.0','35000','2026-02-14','7.0','13','universal',28900000,'18293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f607','https://example.com/wavetunes/v3.5.0','official',true),
  ('33333333-0000-0000-0000-000000000033','22222222-0000-0000-0000-000000000003','3.2.1','32100','2025-08-19','5.0','11','universal',26200000,'293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718','https://example.com/wavetunes/v3.2.1','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for ClipStream
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000041','22222222-0000-0000-0000-000000000004','2.9.0','29000','2026-06-18','8.0','14','arm64-v8a',54800000,'3a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6071829','https://example.com/clipstream/v2.9.0','official',true),
  ('33333333-0000-0000-0000-000000000042','22222222-0000-0000-0000-000000000004','2.7.3','27300','2026-01-30','6.0','12','universal',51200000,'4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293','https://example.com/clipstream/v2.7.3','official',true),
  ('33333333-0000-0000-0000-000000000043','22222222-0000-0000-0000-000000000004','2.5.0','25000','2025-07-22','5.0','10','universal',47800000,'5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4','https://example.com/clipstream/v2.5.0','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for NoteNest
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000051','22222222-0000-0000-0000-000000000005','4.3.0','43000','2026-07-22','8.0','14','universal',22100000,'6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5','https://example.com/notenest/v4.3.0','official',true),
  ('33333333-0000-0000-0000-000000000052','22222222-0000-0000-0000-000000000005','4.1.2','41200','2026-04-08','7.0','13','universal',20800000,'7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6','https://example.com/notenest/v4.1.2','official',true),
  ('33333333-0000-0000-0000-000000000053','22222222-0000-0000-0000-000000000005','3.9.5','39500','2025-11-15','6.0','11','universal',19400000,'8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7','https://example.com/notenest/v3.9.5','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for SnapLight
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000061','22222222-0000-0000-0000-000000000006','4.1.0','40100','2026-07-20','9.0','14','arm64-v8a',28400000,'e6f70718a9b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d7','https://example.com/snaplight/v4.1.0','official',true),
  ('33333333-0000-0000-0000-000000000062','22222222-0000-0000-0000-000000000006','4.0.0','40000','2026-04-11','9.0','13','arm64-v8a',27100000,'f70718a9b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d78','https://example.com/snaplight/v4.0.0','official',true),
  ('33333333-0000-0000-0000-000000000063','22222222-0000-0000-0000-000000000006','3.6.2','36020','2025-10-03','7.0','12','universal',24800000,'0718a9b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789','https://example.com/snaplight/v3.6.2','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for LinguaLab
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000071','22222222-0000-0000-0000-000000000007','6.3.0','60300','2026-06-30','8.0','14','universal',56100000,'18a9b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789a','https://example.com/lingualab/v6.3.0','official',true),
  ('33333333-0000-0000-0000-000000000072','22222222-0000-0000-0000-000000000007','6.1.0','60100','2026-02-18','7.0','13','universal',53800000,'2a9b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789ab','https://example.com/lingualab/v6.1.0','official',true),
  ('33333333-0000-0000-0000-000000000073','22222222-0000-0000-0000-000000000007','5.9.4','50904','2025-08-27','6.0','11','universal',51200000,'3b0c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789abc','https://example.com/lingualab/v5.9.4','official',false)
ON CONFLICT (id) DO NOTHING;

-- Versions for DevKit Tools
INSERT INTO versions (id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified) VALUES
  ('33333333-0000-0000-0000-000000000081','22222222-0000-0000-0000-000000000008','2.5.1','20501','2026-07-25','8.0','14','universal',18400000,'4c1d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789abcd','https://example.com/devkit-tools/v2.5.1','official',true),
  ('33333333-0000-0000-0000-000000000082','22222222-0000-0000-0000-000000000008','2.4.0','20400','2026-03-14','7.0','13','universal',17200000,'5d2e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789abcde','https://example.com/devkit-tools/v2.4.0','official',true),
  ('33333333-0000-0000-0000-000000000083','22222222-0000-0000-0000-000000000008','2.2.0','20200','2025-09-15','6.0','12','universal',15900000,'6e3f40516a7b8c9d0e1f20314a5b6c7d8e9f00112a4b5c6d789abcdef','https://example.com/devkit-tools/v2.2.0','official',false)
ON CONFLICT (id) DO NOTHING;

-- Changelogs
INSERT INTO changelogs (version_id, content, source_url, published_at) VALUES
  ('33333333-0000-0000-0000-000000000011','• New community feed layout\n• Performance improvements for large groups\n• Bug fixes','https://example.com/chatterbox/v5.2.1/changelog','2026-07-15'),
  ('33333333-0000-0000-0000-000000000012','• Added dark mode for community pages\n• New notification controls','https://example.com/chatterbox/v5.1.0/changelog','2026-03-22'),
  ('33333333-0000-0000-0000-000000000013','• Stability improvements for older devices','https://example.com/chatterbox/v4.9.8/changelog','2025-09-10'),
  ('33333333-0000-0000-0000-000000000021','• Improved encryption protocol\n• New disappearing messages feature\n• Bug fixes for media sharing','https://example.com/signaltalk/v7.4.0/changelog','2026-07-28'),
  ('33333333-0000-0000-0000-000000000022','• Added group video calls\n• Improved call quality on low bandwidth','https://example.com/signaltalk/v7.2.1/changelog','2026-01-15'),
  ('33333333-0000-0000-0000-000000000023','• Initial release with new UI','https://example.com/signaltalk/v6.8.0/changelog','2025-06-05'),
  ('33333333-0000-0000-0000-000000000031','• Added hi-res FLAC playback\n• New equalizer presets\n• Fixed crash on Android 14','https://example.com/wavetunes/v3.7.2/changelog','2026-07-05'),
  ('33333333-0000-0000-0000-000000000032','• Redesigned library view\n• Added lyrics support','https://example.com/wavetunes/v3.5.0/changelog','2026-02-14'),
  ('33333333-0000-0000-0000-000000000033','• Bug fixes and performance improvements','https://example.com/wavetunes/v3.2.1/changelog','2025-08-19'),
  ('33333333-0000-0000-0000-000000000041','• Picture-in-picture mode for all videos\n• New subtitle engine with SSA support\n• Performance improvements','https://example.com/clipstream/v2.9.0/changelog','2026-06-18'),
  ('33333333-0000-0000-0000-000000000042','• Added streaming protocol support\n• Fixed audio sync issues','https://example.com/clipstream/v2.7.3/changelog','2026-01-30'),
  ('33333333-0000-0000-0000-000000000043','• Initial public release','https://example.com/clipstream/v2.5.0/changelog','2025-07-22'),
  ('33333333-0000-0000-0000-000000000051','• New markdown editor with live preview\n• Improved sync reliability\n• Dark mode improvements','https://example.com/notenest/v4.3.0/changelog','2026-07-22'),
  ('33333333-0000-0000-0000-000000000052','• Added tag filtering\n• Fixed export to PDF','https://example.com/notenest/v4.1.2/changelog','2026-04-08'),
  ('33333333-0000-0000-0000-000000000053','• Stability improvements','https://example.com/notenest/v3.9.5/changelog','2025-11-15'),
  ('33333333-0000-0000-0000-000000000061','• New manual focus controls\n• Improved low-light performance\n• Bug fixes for RAW export','https://example.com/snaplight/v4.1.0/changelog','2026-07-20'),
  ('33333333-0000-0000-0000-000000000062','• Redesigned editor interface\n• Added preset filters','https://example.com/snaplight/v4.0.0/changelog','2026-04-11'),
  ('33333333-0000-0000-0000-000000000063','• Stability improvements for older devices','https://example.com/snaplight/v3.6.2/changelog','2025-10-03'),
  ('33333333-0000-0000-0000-000000000071','• New spaced-repetition algorithm\n• Added 4 new languages\n• Offline mode improvements','https://example.com/lingualab/v6.3.0/changelog','2026-06-30'),
  ('33333333-0000-0000-0000-000000000072','• Improved audio lesson playback\n• Fixed sync issue on Android 13','https://example.com/lingualab/v6.1.0/changelog','2026-02-18'),
  ('33333333-0000-0000-0000-000000000073','• Added dark mode\n• Performance improvements','https://example.com/lingualab/v5.9.4/changelog','2025-08-27'),
  ('33333333-0000-0000-0000-000000000081','• New JSON inspector with syntax highlighting\n• Added regex tester with capture groups','https://example.com/devkit-tools/v2.5.1/changelog','2026-07-25'),
  ('33333333-0000-0000-0000-000000000082','• Added network ping tool\n• Improved log viewer performance','https://example.com/devkit-tools/v2.4.0/changelog','2026-03-14'),
  ('33333333-0000-0000-0000-000000000083','• Initial public release of the toolbox','https://example.com/devkit-tools/v2.2.0/changelog','2025-09-15')
ON CONFLICT DO NOTHING;

-- Compatibility for ChatterBox
INSERT INTO compatibility (app_id, android_version, version_id, status, notes) VALUES
  ('22222222-0000-0000-0000-000000000001','14.0','33333333-0000-0000-0000-000000000011','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000001','13.0','33333333-0000-0000-0000-000000000011','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000001','12.0','33333333-0000-0000-0000-000000000011','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000001','11.0','33333333-0000-0000-0000-000000000011','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000001','10.0','33333333-0000-0000-0000-000000000011','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000001','9.0','33333333-0000-0000-0000-000000000011','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000001','8.0','33333333-0000-0000-0000-000000000011','compatible','Minimum supported Android for v5.2.1.'),
  ('22222222-0000-0000-0000-000000000001','7.0','33333333-0000-0000-0000-000000000012','limited','Use legacy version 5.1.0.'),
  ('22222222-0000-0000-0000-000000000001','6.0','33333333-0000-0000-0000-000000000013','limited','Use legacy version 4.9.8.'),
  ('22222222-0000-0000-0000-000000000001','5.0','33333333-0000-0000-0000-000000000013','incompatible','Not supported on Android 5.0.'),

  ('22222222-0000-0000-0000-000000000002','14.0','33333333-0000-0000-0000-000000000021','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000002','13.0','33333333-0000-0000-0000-000000000021','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000002','12.0','33333333-0000-0000-0000-000000000021','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000002','11.0','33333333-0000-0000-0000-000000000021','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000002','10.0','33333333-0000-0000-0000-000000000021','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000002','9.0','33333333-0000-0000-0000-000000000022','limited','Use version 7.2.1.'),
  ('22222222-0000-0000-0000-000000000002','8.0','33333333-0000-0000-0000-000000000022','compatible','Use version 7.2.1.'),
  ('22222222-0000-0000-0000-000000000002','7.0','33333333-0000-0000-0000-000000000021','compatible','Minimum supported Android for v7.4.0.'),
  ('22222222-0000-0000-0000-000000000002','6.0','33333333-0000-0000-0000-000000000023','limited','Use legacy version 6.8.0.'),
  ('22222222-0000-0000-0000-000000000002','5.0','33333333-0000-0000-0000-000000000023','compatible','Minimum supported Android for v6.8.0.'),

  ('22222222-0000-0000-0000-000000000003','14.0','33333333-0000-0000-0000-000000000031','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000003','13.0','33333333-0000-0000-0000-000000000031','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000003','12.0','33333333-0000-0000-0000-000000000031','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000003','11.0','33333333-0000-0000-0000-000000000031','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000003','10.0','33333333-0000-0000-0000-000000000031','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000003','9.0','33333333-0000-0000-0000-000000000031','compatible','Minimum supported Android for v3.7.2.'),
  ('22222222-0000-0000-0000-000000000003','8.0','33333333-0000-0000-0000-000000000032','limited','Use version 3.5.0.'),
  ('22222222-0000-0000-0000-000000000003','7.0','33333333-0000-0000-0000-000000000032','compatible','Use version 3.5.0.'),
  ('22222222-0000-0000-0000-000000000003','6.0','33333333-0000-0000-0000-000000000033','limited','Use legacy version 3.2.1.'),
  ('22222222-0000-0000-0000-000000000003','5.0','33333333-0000-0000-0000-000000000033','compatible','Minimum supported Android for v3.2.1.'),

  ('22222222-0000-0000-0000-000000000004','14.0','33333333-0000-0000-0000-000000000041','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000004','13.0','33333333-0000-0000-0000-000000000041','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000004','12.0','33333333-0000-0000-0000-000000000041','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000004','11.0','33333333-0000-0000-0000-000000000041','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000004','10.0','33333333-0000-0000-0000-000000000041','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000004','9.0','33333333-0000-0000-0000-000000000042','limited','Use version 2.7.3.'),
  ('22222222-0000-0000-0000-000000000004','8.0','33333333-0000-0000-0000-000000000041','compatible','Minimum supported Android for v2.9.0.'),
  ('22222222-0000-0000-0000-000000000004','7.0','33333333-0000-0000-0000-000000000042','compatible','Use version 2.7.3.'),
  ('22222222-0000-0000-0000-000000000004','6.0','33333333-0000-0000-0000-000000000042','compatible','Use legacy version 2.7.3.'),
  ('22222222-0000-0000-0000-000000000004','5.0','33333333-0000-0000-0000-000000000043','limited','Use legacy version 2.5.0.'),

  ('22222222-0000-0000-0000-000000000005','14.0','33333333-0000-0000-0000-000000000051','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000005','13.0','33333333-0000-0000-0000-000000000051','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000005','12.0','33333333-0000-0000-0000-000000000051','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000005','11.0','33333333-0000-0000-0000-000000000051','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000005','10.0','33333333-0000-0000-0000-000000000051','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000005','9.0','33333333-0000-0000-0000-000000000052','limited','Use version 4.1.2.'),
  ('22222222-0000-0000-0000-000000000005','8.0','33333333-0000-0000-0000-000000000051','compatible','Minimum supported Android for v4.3.0.'),
  ('22222222-0000-0000-0000-000000000005','7.0','33333333-0000-0000-0000-000000000052','compatible','Use version 4.1.2.'),
  ('22222222-0000-0000-0000-000000000005','6.0','33333333-0000-0000-0000-000000000053','limited','Use legacy version 3.9.5.'),

  ('22222222-0000-0000-0000-000000000006','14.0','33333333-0000-0000-0000-000000000061','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000006','13.0','33333333-0000-0000-0000-000000000061','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000006','12.0','33333333-0000-0000-0000-000000000061','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000006','11.0','33333333-0000-0000-0000-000000000061','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000006','10.0','33333333-0000-0000-0000-000000000062','compatible','Use version 4.0.0.'),
  ('22222222-0000-0000-0000-000000000006','9.0','33333333-0000-0000-0000-000000000061','compatible','Minimum supported Android for v4.1.0.'),
  ('22222222-0000-0000-0000-000000000006','8.0','33333333-0000-0000-0000-000000000062','limited','Use legacy version 4.0.0.'),
  ('22222222-0000-0000-0000-000000000006','7.0','33333333-0000-0000-0000-000000000063','limited','Use legacy version 3.6.2.'),

  ('22222222-0000-0000-0000-000000000007','14.0','33333333-0000-0000-0000-000000000071','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000007','13.0','33333333-0000-0000-0000-000000000071','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000007','12.0','33333333-0000-0000-0000-000000000071','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000007','11.0','33333333-0000-0000-0000-000000000071','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000007','10.0','33333333-0000-0000-0000-000000000072','compatible','Use version 6.1.0.'),
  ('22222222-0000-0000-0000-000000000007','9.0','33333333-0000-0000-0000-000000000072','limited','Some features limited.'),
  ('22222222-0000-0000-0000-000000000007','8.0','33333333-0000-0000-0000-000000000071','compatible','Minimum supported Android for v6.3.0.'),
  ('22222222-0000-0000-0000-000000000007','7.0','33333333-0000-0000-0000-000000000072','compatible','Use legacy version 6.1.0.'),
  ('22222222-0000-0000-0000-000000000007','6.0','33333333-0000-0000-0000-000000000073','limited','Use legacy version 5.9.4.'),

  ('22222222-0000-0000-0000-000000000008','14.0','33333333-0000-0000-0000-000000000081','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000008','13.0','33333333-0000-0000-0000-000000000081','compatible','Full support.'),
  ('22222222-0000-0000-0000-000000000008','12.0','33333333-0000-0000-0000-000000000081','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000008','11.0','33333333-0000-0000-0000-000000000081','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000008','10.0','33333333-0000-0000-0000-000000000081','compatible','Compatible.'),
  ('22222222-0000-0000-0000-000000000008','9.0','33333333-0000-0000-0000-000000000082','limited','Use version 2.4.0.'),
  ('22222222-0000-0000-0000-000000000008','8.0','33333333-0000-0000-0000-000000000081','compatible','Minimum supported Android for v2.5.1.'),
  ('22222222-0000-0000-0000-000000000008','7.0','33333333-0000-0000-0000-000000000082','limited','Use legacy version 2.4.0.')
ON CONFLICT DO NOTHING;

-- Screenshots
INSERT INTO screenshots (app_id, image_url, alt_text, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=800&fit=crop','ChatterBox feed view',1),
  ('22222222-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=800&fit=crop','ChatterBox community page',2),
  ('22222222-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=800&fit=crop','SignalTalk chat',1),
  ('22222222-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1611162616475-46f6bca3308e?w=400&h=800&fit=crop','SignalTalk settings',2),
  ('22222222-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=800&fit=crop','WaveTunes player',1),
  ('22222222-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=800&fit=crop','WaveTunes library',2),
  ('22222222-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1574375927938-d5a98e8ffe7a?w=400&h=800&fit=crop','ClipStream player',1),
  ('22222222-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1574629810360-7efbff19550b?w=400&h=800&fit=crop','ClipStream subtitles',2),
  ('22222222-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=800&fit=crop','NoteNest editor',1),
  ('22222222-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=800&fit=crop','NoteNest tags',2),
  ('22222222-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1500627964684-13335fc86582?w=400&h=800&fit=crop','SnapLight camera',1),
  ('22222222-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=800&fit=crop','SnapLight editor',2),
  ('22222222-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1453733190371-0a90364e2113?w=400&h=800&fit=crop','LinguaLab lessons',1),
  ('22222222-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=800&fit=crop','LinguaLab flashcards',2),
  ('22222222-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=800&fit=crop','DevKit Tools home',1),
  ('22222222-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=800&fit=crop','DevKit JSON inspector',2)
ON CONFLICT DO NOTHING;
