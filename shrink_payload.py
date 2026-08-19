import json

d = json.load(open('vercel_deploy_input.json'))
files = d.get('files')
print('before:', len(files))

skip_dir = {'prompts', 'responses', 'opus_out_v2', 'opus_out_v3', 'opus_out_v4', 'opus_out_v5', '__pycache__'}
skip_names = {
    'DEPLOY_STATE.md', 'UI_UPDATE_PLAN.md', 'PROMPTS_IMAGES.md',
    'make_vercel_payload.py', 'optimize_assets.py', 'clean_edges.py',
    'call_codex.py', 'extract_blocks.py', 'extract_questions.py',
    'merge_questions.py', 'analyze_parts.py', 'debug_p1.py', 'debug_p2.py',
    'debug_qs.js', 'fix_qv.py', 'read_deploys.py', 'check_deploy_detail.py',
    'find_project.py', 'shrink_payload.py', 'git_push_plan.py',
    'boss_legacy_backup.js', 'boss_new_base.js', 'bossHall_new_base.js',
    'timeAttack_new_base.js', 'compress_assets.py', 'webp_assets.py',
    'png_to_webp_refs.py', 'process_boss_images.py', 'process_assets.py',
    'call_opus.py', 'parse_opus_blocks.py', 'call_opus_review.py',
    'merge_boss.py', 'test_img_api.py', 'gen_images.py', 'call_claude.py',
    'remove_magenta.py', 'check_payload.py', 'qa_all.js', 'qa_questions.js',
    'repro.js', 'fix_app.js', 'build_questions.py',
    'boss_lex.png', 'boss_kawi.png', 'boss_terra.png',
    'arena_kawi.jpg', 'arena_lex.jpg', 'arena_terra.jpg',
    'item_shield_new.png', 'item_potion.png', 'item_boost.png',
    'event_asteroid.png', 'event_blackhole.png', 'event_gift.png',
    'pet_mito.png', 'test_img_api.png',
    'DEPLOY_STATE.md', 'UI_UPDATE_PLAN.md', 'PROMPTS_IMAGES.md',
    'QA_MINIGAME.md', 'BOSS_BATTLE_DESIGN.md', 'PROMPTS_BOSS_IMAGES.md',
    'QA_BOSS_ASSETS.md', 'prompt_opus_boss.txt', 'opus_boss_output.md',
    'prompt_opus_boss2.txt', 'opus_boss_output2.md', 'QA_BOSS_CODE.md',
    'merge_boss.py', 'prompt_opus_boss_review.txt',
    'opus_boss_review_output.md', 'prompt_opus_boss_v3.txt', 'boss_current.js',
    'opus_boss_v3_output.md', 'OPUS_INTEGRATION_NOTES.md',
    'TASK_STATE_SPREAD_PADS.md', 'prompt_opus_bossrush.txt',
    'TASK_STATE_BOSSRUSH.md', 'opus_bossrush_v2.md', 'opus_bossrush_v3.md',
    'prompt_opus_v2_continuation.txt', 'prompt_opus_v4_files.txt',
    'opus_bossrush_v4.md', 'prompt_opus_v5_tail.txt', 'opus_bossrush_v5.md',
    'QA_BOSSRUSH_STATE.md', 'BOSS_RUSH_PLAN.md', 'IMG_API_NOTES.md',
    'patch_boss_anim.py', 'patch_boss_anim2.py', 'patch_boss_anim3.py',
    'patch_boss_fixes.py', 'patch_hall_skills.py', 'patch_overlap_skills.py',
    'patch_landing_guide.py', 'patch_skills_css.sh', 'patch_sprites.py',
    'ART_FIX_TASK.md', 'QA_STATE.md', 'SKILL_ICON_TASK.md', 'ASSETS_CONTEXT.md',
    'BOSS_REVIEW.md', 'NOTES_MOBILE_FIX.md', 'optimize_assets2.py',
    'optimize_payload_imgs.py', 'inspect_payload.py', 'call_opus_ns.py',
    'fix_hall_comma.py', 'remove_bg.py', 'check_cut.py', 'apply_cuts.py',
    'deploy_result.txt', 'opus_bossrush_v1.md', 'opus_out_boss_anim.md',
    'opus_prompt_boss_anim.md',
    'ASSETS_STATUS.md', 'module1.md', 'module1a.md', 'module1b.md',
}

keep = []
total = 0
for f in files:
    p = f.get('file') or f.get('path') or ''
    if not p:
        keep.append(f)
        continue
    top = p.split('/')[0]
    if top in skip_dir:
        continue
    bn = p.split('/')[-1]
    if bn in skip_names or bn.startswith('.'):
        continue
    content = f.get('content') or f.get('data') or ''
    f['size'] = len(content.encode('utf-8')) if isinstance(content, str) else len(content)
    total += f['size']
    keep.append(f)

d['files'] = keep
json.dump(d, open('vercel_deploy_input.json', 'w'))
print('after:', len(keep), 'total MB:', round(total / 1048576, 2))
