#!/bin/bash
FILE="history.txt"
SELECTED_USER=""
START_DATE=""

data() {
    local entry
    if [[ -n "$SELECTED_USER" ]]; then
        entry=$(grep "\] $SELECTED_USER |" "$FILE")
    else
        entry=$(cat "$FILE")
    fi
    
    if [[ -n "$START_DATE" ]]; then
        entry=$(echo "$entry" | awk -v d="$START_DATE" '$0 >= "["d')
    fi
    echo "$entry"
}

while true; do
    printf "\n1)User 2)View 3)Stats 4)Del 5)Rot 6)Sort 7)Exit\nChoice: "
    read -r choice

    case $choice in
        1)
            read -r -p "Username (blank=all): " SELECTED_USER ;;
        2)
            data | less ;;
        3)
            read -r -p "Filter since (YYYY-MM-DD HH:MM) or blank: " START_DATE
            data | awk -F'|' '
            { sum_score+=$2; sum_time+=$4; if($3~/wall/)wall++; n++ }
            END { if(n) printf "Games:%d AvgScore:%.1f AvgTime:%.1fs WallDeaths:%d(%.0f%%)\n",
            n, sum_score/n, sum_time/n, wall, wall/n*100; else print "No data found." }' 
            START_DATE="" ;;
        4)
            read -r -p "Delete (User/Timestamp/Invalid): " target
            [[ -z "$target" ]] && continue
            read -r -p "Confirm delete '$target'? (y/n): " confirm
            if [[ "$confirm" == "y" ]]; then
                if [[ "$target" == "invalid" ]]; then
                    grep -E "^\[.*\] .*\|.*\|.*\|.*$" "$FILE" > "$FILE.tmp"
                else
                    grep -v "$target" "$FILE" > "$FILE.tmp"
                fi
                mv "$FILE.tmp" "$FILE" && echo "Done."
            fi ;;
        5)
            tar -czf "history_$(date +%Y%m%d).tar.gz" "$FILE"
            tail -n 10 "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
            echo "Rotated." ;;
        6)
            read -r -p "Sort by (score/user/time): " sort_type
            case $sort_type in
                score) data | sort -t'|' -k2,2 -nr ;;
                user)  data | sort -t']' -k2;;
                *)     data | sort -r ;;
            esac ;;
        7)
            echo "Goodbye!"; exit 0 ;;
    esac
done