#!/bin/bash

for i in {1..50}
do 
for j in {1..10}
do
node src/index.js $i $j 500 &
done
done
wait