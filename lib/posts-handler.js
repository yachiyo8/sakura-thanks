'use strict';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const util = require('./handler-util');

async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const messages = await prisma.message.findMany({
          where: { approved: true },
          orderBy: { id: 'asc' }
        });
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(messages));
      } catch (e) {
        console.error('GET /api/messages Error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'データの取得に失敗しました' }));
      }
      break;

    case 'POST':
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      }).on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const text = (parsed.message || '').trim();

          if (!text || text.length > 100) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'メッセージは1〜100文字で入力してください' }));
            return;
          }

          const created = await prisma.message.create({
            data: {
              message: text
            }
          });

          res.writeHead(201, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify(created));
        } catch (e) {
          console.error('POST /api/messages Error:', e);
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'データの保存に失敗しました' }));
        }
      });
      break;

    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = {
  handle
};