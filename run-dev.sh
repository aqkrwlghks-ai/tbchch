#!/bin/bash

# 1. 이동할 작업 디렉터리 경로 설정
PROJECT_DIR="/Users/jihwanpark/Library/Mobile Documents/com~apple~CloudDocs/안티그라비트/tbchch"

echo "============================================="
echo " 신덕교회 홈페이지 (tbchch) 개발 서버 시작"
echo "============================================="

# 2. 프로젝트 폴더로 이동
cd "$PROJECT_DIR" || { echo "❌ 프로젝트 폴더를 찾을 수 없습니다: $PROJECT_DIR"; exit 1; }

# 3. 혹시 iCloud에서 오프로드된 파일이 있는지 검사 및 다운로드
echo "🔍 iCloud 오프로드 파일(임시 링크) 점검 중..."
OFFLOADED_FILES=$(find . -path "*/node_modules*" -prune -o -name ".*.icloud" -print)

if [ -n "$OFFLOADED_FILES" ]; then
    echo "🔄 오프로드된 파일을 발견하여 다운로드를 시작합니다..."
    echo "$OFFLOADED_FILES" | while read -r file; do
        if [ -n "$file" ]; then
            # .filename.ext.icloud -> filename.ext 형식으로 파일명 변환
            dir_name=$(dirname "$file")
            base_name=$(basename "$file")
            # 앞의 온점(.)과 뒤의 .icloud 제거
            real_base=$(echo "$base_name" | sed 's/^\.\(.*\)\.icloud$/\1/')
            real_file="$dir_name/$real_base"
            
            echo "⬇️ 다운로드 중: $real_file"
            brctl download "$real_file"
        fi
    done
    
    # 다운로드가 완료될 때까지 잠시 대기
    echo "⏳ 다운로드 완료 대기 중..."
    sleep 3
else
    echo "✅ 모든 소스 파일이 로컬에 다운로드되어 있습니다."
fi

# 4. 개발 서버 실행
echo "🚀 개발 서버를 구동합니다..."
npm run dev
