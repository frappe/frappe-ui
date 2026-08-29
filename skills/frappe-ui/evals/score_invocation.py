#!/usr/bin/env python3
"""Objectively score skill invocation from workflow agent transcripts.

Maps each agent transcript to an eval case by finding the case's output path
in the agent's first user message, then reports what the agent actually did.
Self-report is never used.
"""
import json, glob, sys, os, re

def blocks(rec):
    c = rec.get('message', {}).get('content')
    return c if isinstance(c, list) else []

def scan(path):
    first_user = None
    tools = []
    for line in open(path, errors='replace'):
        try:
            r = json.loads(line)
        except Exception:
            continue
        if first_user is None and r.get('type') == 'user':
            c = r.get('message', {}).get('content')
            if isinstance(c, str):
                first_user = c
            elif isinstance(c, list):
                first_user = ' '.join(b.get('text', '') for b in c if isinstance(b, dict))
        for b in blocks(r):
            if isinstance(b, dict) and b.get('type') == 'tool_use':
                tools.append((b.get('name'), b.get('input') or {}))
    return first_user or '', tools

SKILL_FILE = re.compile(r'skills/frappe-ui/(SKILL|CORE|SETUP|DATA)\.md')

def classify(tools):
    skill_tool = False
    refs = set()
    for name, inp in tools:
        if name == 'Skill' and 'frappe-ui' in json.dumps(inp):
            skill_tool = True
        blob = json.dumps(inp)
        for m in SKILL_FILE.finditer(blob):
            refs.add(m.group(1) + '.md')
    return skill_tool, sorted(refs)

def main(transcript_dir, cases_json, out_json, marker_key):
    cases = json.load(open(cases_json))['cases']
    results = {}
    files = glob.glob(os.path.join(transcript_dir, 'agent-*.jsonl'))
    for f in files:
        fu, tools = scan(f)
        for c in cases:
            marker = marker_key.format(id=c['id'])
            if marker in fu:
                skill_tool, refs = classify(tools)
                results[c['id']] = {
                    'case_id': c['id'],
                    'bucket': c['bucket'],
                    'expect_skill': c['expect_skill'],
                    'skill_tool_invoked': skill_tool,
                    'skill_files_read': refs,
                    'read_any_ref': bool(refs),
                    'used_skill': skill_tool or bool(refs),
                    'transcript': os.path.basename(f),
                    'tool_calls': len(tools),
                }
                break
    missing = [c['id'] for c in cases if c['id'] not in results]
    json.dump({'results': results, 'unmatched_cases': missing,
               'transcripts_seen': len(files)}, open(out_json, 'w'), indent=2)
    ok = sum(1 for r in results.values() if r['used_skill'] == r['expect_skill'])
    print(f"matched {len(results)}/{len(cases)} cases; invocation correct: {ok}/{len(results)}")
    if missing:
        print("UNMATCHED:", missing)
    for r in sorted(results.values(), key=lambda x: x['case_id']):
        flag = 'ok ' if r['used_skill'] == r['expect_skill'] else 'FAIL'
        print(f"  {flag} {r['case_id']:<16} {r['bucket']:<16} expect={r['expect_skill']!s:<5} "
              f"skill_tool={r['skill_tool_invoked']!s:<5} refs={','.join(r['skill_files_read']) or '-'}")

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
