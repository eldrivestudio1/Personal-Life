import test from 'node:test';
import assert from 'node:assert/strict';
import {addDays,getWeek,parseDate} from '../js/dates.js';
import {budgetSummary,descendants,makeTask,visibleTasks,taskHasOpenChildren} from '../js/domain.js';
import {exponent,formatMoney,toMinor} from '../js/currency.js';

test('date-only helpers preserve local calendar dates',()=>{assert.equal(addDays('2026-01-01',-1),'2025-12-31');assert.equal(parseDate('2026-02-30'),null);assert.deepEqual(getWeek('2026-10-11'),['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09','2026-10-10','2026-10-11'])});
test('task creation and filtering retain parent relationships',()=>{const parent=makeTask({title:'Rencana',priority:'high'}),child=makeTask({title:'Langkah',parentId:parent.id});const tasks=[parent,{...child,dueDate:'2026-10-11'}];assert.equal(child.parentId,parent.id);assert.equal(visibleTasks(tasks,'today').length,1);assert.equal(taskHasOpenChildren(tasks,parent.id),true);assert.deepEqual([...descendants(tasks,parent.id)],[parent.id,child.id])});
test('budget arithmetic uses only matching currency, period, and category',()=>{const expenses=[{amountMinor:2500,currency:'IDR',occurredOn:'2026-10-02',categoryId:'food'},{amountMinor:1200,currency:'SGD',occurredOn:'2026-10-04',categoryId:'food'},{amountMinor:400,currency:'IDR',occurredOn:'2026-09-30',categoryId:'food'}];const result=budgetSummary(expenses,{period:'monthly',currency:'IDR',limitMinor:2000,categoryId:'food'},'2026-10-11');assert.equal(result.spent,2500);assert.equal(result.remaining,-500);assert.equal(result.usedPercent,125)});

test('actual duration is normalized to integer minutes',()=>{const task=makeTask({title:'Catatan',estimatedMinutes:'25',actualMinutes:'32'});assert.equal(task.estimatedMinutes,25);assert.equal(task.actualMinutes,32)});

test('currency precision follows ISO currency digits and rejects unsafe minor-unit values',()=>{assert.equal(exponent('JPY'),0);assert.equal(exponent('KWD'),3);assert.equal(toMinor('12.345','KWD'),12345);assert.equal(toMinor('12.5','JPY'),13);assert.equal(toMinor('1e30','IDR'),null);assert.match(formatMoney(12345,'KWD'),/12/)});
