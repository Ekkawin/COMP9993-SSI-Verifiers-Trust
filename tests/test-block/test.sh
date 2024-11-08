#!/bin/bash


for ((i=1; i<=$1; i++)); do 
# echo "hi"
  node src/index.js $1 $i &
done
wait