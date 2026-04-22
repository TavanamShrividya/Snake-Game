#!/bin/bash
FILE="history.txt"
SELECTED_USER=""

if [[ ! -s "$FILE" ]]; then
    echo "Error: $FILE is missing or empty."
    exit 1
fi

while true; do
    printf "\n1)User 2)View 3)Stats 4)Del 5)Rot 6)Sort 7)Exit\nChoice: "
    read -r choice

    case $choice in
        1)
            read -r -p "Username: " SELECTED_USER;;
        2)
            if [[ -n "$SELECTED_USER" ]]; then
                grep " | $SELECTED_USER | " "$FILE" | less
            else
                less "$FILE"
            fi;;
        3)
            if [[ -n "$SELECTED_USER" ]]; then
                grep " | $SELECTED_USER | " "$FILE" 
            else
                cat "$FILE"
            fi | awk -F'|' '
            {
                sum_score += $2; 
                sum_time += $4; 
                if($3 ~ /WALL/) wall++; 
                count++
            } 
            END {
                if (count > 0) 
                    printf "Games: %d | Avg Score: %.2f | Avg Time: %.2fs | Wall Deaths: %d\n", 
                    count, sum_score/count, sum_time/count, wall
            }'
            ;;
        4)
            read -r -p "Target User/Timestamp: " target
            read -r -p "Delete '$target'? (y/n): " confirm
            [[ "$confirm" == "y" ]] && sed -i "/$target/d" "$FILE"
            ;;
        5)
            tar -czf history_$(date +%s).tar.gz "$FILE"
            tail -n 10 "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
            ;;
        6)
            sort -t'|' -k2 -nr "$FILE"
            ;;
        7)
            exit 0
            ;;
    esac
done