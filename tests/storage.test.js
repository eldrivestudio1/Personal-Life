import test from 'node:test';
import assert from 'node:assert/strict';
import {freshData,saveData,validateData,STORAGE_KEY} from '../js/storage.js';

test('empty data envelope validates and receives default categories',()=>{const data=freshData();const checked=validateData(data);assert.equal(checked.ok,true);assert.ok(checked.data.categories.length>0)});
test('older numeric string duration values are normalized before saving',()=>{const data=freshData();data.tasks=[{id:'t1',title:'Tugas',status:'open',priority:'normal',estimatedMinutes:'25',actualMinutes:'32'}];const checked=validateData(data);assert.equal(checked.ok,true);assert.equal(checked.data.tasks[0].estimatedMinutes,25);assert.equal(checked.data.tasks[0].actualMinutes,32)});
test('invalid parent references and malformed categories are rejected',()=>{const data=freshData();data.tasks=[{id:'child',title:'Langkah',status:'open',priority:'normal',parentId:'missing'}];assert.equal(validateData(data).ok,false);const bad=freshData();bad.categories=[{id:1,name:null,icon:'x'}];assert.equal(validateData(bad).ok,false)});
test('unsupported schema versions cannot replace stored data',()=>{const data=freshData();data.schemaVersion=99;const checked=validateData(data);assert.equal(checked.ok,false)});
test('cyclic subtasks are rejected before import',()=>{const data=freshData();data.tasks=[{id:'a',title:'A',status:'open',priority:'normal',parentId:'b'},{id:'b',title:'B',status:'open',priority:'normal',parentId:'a'}];assert.equal(validateData(data).ok,false)});

test('saveData writes the complete validated envelope and reports storage failures',()=>{let savedKey='',savedValue='';globalThis.localStorage={setItem:(key,value)=>{savedKey=key;savedValue=value}};const ok=saveData(freshData());assert.equal(ok.ok,true);assert.equal(savedKey,STORAGE_KEY);assert.equal(JSON.parse(savedValue).schemaVersion,1);globalThis.localStorage={setItem:()=>{const error=new Error('quota');error.name='QuotaExceededError';throw error}};const failed=saveData(freshData());assert.equal(failed.ok,false);assert.match(failed.error,/penuh/);delete globalThis.localStorage});

test('unknown currency codes are rejected instead of crashing currency formatting',()=>{const data=freshData();data.settings.currency='ZZZ';assert.equal(validateData(data).ok,false)});
