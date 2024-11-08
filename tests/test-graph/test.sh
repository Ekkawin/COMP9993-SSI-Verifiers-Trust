#!/bin/bash

for i in {1..10}
do 
for j in {1..70}
do
node src/index.js $i $j 700 &
done
done
wait