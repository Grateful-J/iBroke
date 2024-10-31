<template>
  <div class="text-xl text-white">
    <h1>Options Tracker</h1>
  </div>
</template>

<script setup lang="ts" name="OptionsTracker">
console.log(`Options Tracker found`)
/*
TODO:
1 Track Options somehow?
2 map an object of arrays?
  > one for each action
3 Keep a running total of options revenue
4 earning plays: Sell to Open, Sell to Close
5 negative plays: Buy to Close, Buy to Open
6 Track options:
  if an Open action is made, kepe track of the underlying asset
  if a Close action is made, refrence expiration date of open order and close
  * wild card: assigned or expired
  if assigned (negative price action but also a later TODO: would count as a track sell (Put) or buy (Call))
  if expired (positive action)
  * note* but doesnt affect pricing> roll an option
7 Create a live view of Open Options
8 Show perforamnce metrics and suggestions for exit strategy based on risk toelrance
9 TODO: create a Tax window:
  > ????
   brain is dead

10





 */
</script>
