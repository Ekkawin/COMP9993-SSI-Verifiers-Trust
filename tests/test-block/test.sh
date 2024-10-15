#!/bin/bash

for i in {1..500}
do 
# echo "hi"
  node src/index.js 500 &
done
wait