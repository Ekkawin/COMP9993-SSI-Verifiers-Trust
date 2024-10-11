#!/bin/bash

for i in {1..700}
do 
# echo "hi"
  node src/index.js 700 &
done
wait