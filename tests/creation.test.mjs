import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDetails, validateMedia, EMPTY_FORM } from '../src/lib/creation.ts';

const video = { uri: 'file:///clip.mp4', type: 'video', name: 'clip.mp4', duration: 10000, width: 720, height: 1280, size: 1e6 };
const photo = { ...video, type: 'image', duration: 0, name: 'car.jpg' };
const details = { ...EMPTY_FORM, title: 'Toyota 86 Coupe', make: 'Toyota', model: '86', price: '75000', mileage: '12000', location: 'Dubai', description: 'Well-maintained car with service history.' };

test('photo listings accept only a bounded static photo gallery', () => {
  assert.deepEqual(validateMedia('photos', [photo]), []);
  assert.ok(validateMedia('photos', []).length);
  assert.ok(validateMedia('photos', Array(13).fill(photo)).length);
  assert.ok(validateMedia('photos', [video]).length);
});
test('raw template sequences require 3–6 real video clips and at most 60 seconds', () => {
  assert.deepEqual(validateMedia('raw', Array(3).fill(video)), []);
  assert.ok(validateMedia('raw', Array(2).fill(video)).length);
  assert.ok(validateMedia('raw', Array(7).fill(video)).length);
  assert.ok(validateMedia('raw', Array(3).fill({ ...video, duration: 21000 })).length);
});
test('finished videos and posts reject 4K, oversized files and unreadable metadata', () => {
  assert.deepEqual(validateMedia('ready', [video]), []);
  assert.ok(validateMedia('post', [video, video]).length);
  for (const change of [{ width: 2160, height: 3840 }, { size: 101 * 1024 * 1024 }, { duration: 0 }, { duration: NaN }, { width: 0 }]) assert.ok(validateMedia('ready', [{ ...video, ...change }]).length);
});
test('sale paths require price and mileage; social videos do not acquire a price', () => {
  assert.deepEqual(validateDetails('ready', details), []);
  assert.ok(validateDetails('photos', { ...details, price: '', mileage: '' }).length);
  assert.deepEqual(validateDetails('post', { ...details, price: '', mileage: '' }), []);
  assert.ok(validateDetails('raw', { ...details, price: '-1' }).length);
  assert.ok(validateDetails('raw', { ...details, price: 'not a price' }).length);
});
test('all paths validate meaningful car details and model year', () => {
  assert.ok(validateDetails('post', { ...EMPTY_FORM }).length);
  assert.ok(validateDetails('post', { ...details, year: '2100' }).length);
  assert.ok(validateDetails('post', { ...details, title: 'x', description: 'x' }).length);
});
