#!/usr/bin/env node

import { buildCli } from 'cliver'
import { commands } from 'adapter-test'

buildCli({ commands })