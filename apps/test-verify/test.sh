#!/bin/bash

for i in {1..350}
do 
# echo "hi"
  node src/index.js &
done
wait