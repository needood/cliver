#!/usr/bin/env node
import { createCli } from './create-cli'
import pkg from '../package.json'
import updateNotifier from 'update-notifier'
// Check if update is available
updateNotifier({ pkg }).notify()

createCli(process.argv)
