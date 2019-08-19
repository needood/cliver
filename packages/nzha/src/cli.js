#!/usr/bin/env node

import { buildCli } from 'cliver'
import { commands } from './commands'

buildCli({ commands })